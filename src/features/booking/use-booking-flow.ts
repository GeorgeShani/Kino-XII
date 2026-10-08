import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { moviesKeys } from "@/features/movies/hooks";
import { useFilterOptions } from "@/features/sessions/hooks";
import { toApiError } from "@/lib/api/errors";
import { useSingleFlightMutate } from "@/lib/hooks/use-single-flight-mutate";
import type { Order, Seat, SeatHold, TicketTypeSlug } from "@/types/api";
import {
  createHold,
  createOrder,
  fetchHold,
  type OrderInput,
  releaseHold,
} from "./api";
import {
  type BookingNotice,
  bookingReducer,
  initialBookingState,
} from "./flow-reducer";
import { sameSelection } from "./pricing";
import { bookingKeys, bookingSessionQuery, seatMapQuery } from "./queries";
import { useCountdown } from "./use-countdown";

const EXPIRED_NOTICE: BookingNotice = {
  message: "Your hold time expired. Please re-select your seats.",
};

const holdStorageKey = (sessionId: number) => `kino-hold:${sessionId}`;

const storage = {
  get(sessionId: number) {
    try {
      return sessionStorage.getItem(holdStorageKey(sessionId));
    } catch {
      return null;
    }
  },
  set(sessionId: number, holdId: string) {
    try {
      sessionStorage.setItem(holdStorageKey(sessionId), holdId);
    } catch {}
  },
  clear(sessionId: number) {
    try {
      sessionStorage.removeItem(holdStorageKey(sessionId));
    } catch {}
  },
};

function contestedNotice(codes: string[]): BookingNotice {
  const list = codes.join(", ");
  return {
    message: list
      ? `Seat${codes.length > 1 ? "s" : ""} ${list} ${codes.length > 1 ? "were" : "was"} just taken. Your other seats are still selected.`
      : "Some of those seats were just taken. Please pick again.",
  };
}

export function useBookingFlow(sessionId: number) {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const session = useQuery(bookingSessionQuery(sessionId));
  const seatMap = useQuery(seatMapQuery(sessionId));
  const { data: options } = useFilterOptions();

  const refreshSeatMap = useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: bookingKeys.seatMap(sessionId),
      }),
    [queryClient, sessionId],
  );

  const handleContested = useCallback(
    (codes: string[]) => {
      dispatch({ type: "contested", codes, notice: contestedNotice(codes) });
      storage.clear(sessionId);
      void refreshSeatMap();
    },
    [refreshSeatMap, sessionId],
  );

  const handleExpired = useCallback(() => {
    if (stateRef.current.step === "confirmed") return;
    dispatch({ type: "reset", notice: EXPIRED_NOTICE });
    storage.clear(sessionId);
    void refreshSeatMap();
  }, [refreshSeatMap, sessionId]);

  const remainingMs = useCountdown(
    state.hold?.expiresAt ?? null,
    handleExpired,
  );

  useEffect(() => {
    const holdId = storage.get(sessionId);
    if (!holdId) return;

    const controller = new AbortController();
    fetchHold(holdId, controller.signal)
      .then((hold) => {
        if (hold.isLive && hold.sessionId === sessionId) {
          dispatch({ type: "restored", hold });
        } else {
          storage.clear(sessionId);
        }
      })
      .catch(() => storage.clear(sessionId));

    return () => controller.abort();
  }, [sessionId]);

  useEffect(
    () => () => {
      const { hold, step } = stateRef.current;
      if (hold && step !== "confirmed") {
        releaseHold(hold.holdId).catch(() => {});
        storage.clear(sessionId);
      }
    },
    [sessionId],
  );

  const holdMutation = useMutation({
    mutationFn: () =>
      createHold(
        sessionId,
        stateRef.current.selection.map(({ seatId, ticketType }) => ({
          seatId,
          ticketType,
        })),
      ),
    onSuccess: (hold: SeatHold) => {
      storage.set(sessionId, hold.holdId);
      dispatch({ type: "held", hold });
    },
    onError: (error) => {
      const apiError = toApiError(error);
      if (apiError.kind === "conflict") {
        handleContested(apiError.contested);
        return;
      }
      dispatch({
        type: "notice",
        notice: {
          message: apiError.message,
          profileLink: /profile/i.test(apiError.message),
        },
      });
    },
  });

  const orderMutation = useMutation({
    mutationFn: (input: Omit<OrderInput, "holdId">) => {
      const hold = stateRef.current.hold;
      if (!hold) throw new Error("No active hold");
      return createOrder({ ...input, holdId: hold.holdId });
    },
    onSuccess: (order: Order) => {
      storage.clear(sessionId);
      dispatch({ type: "ordered", order });
      void queryClient.invalidateQueries({ queryKey: ["tickets"] });
      void queryClient.invalidateQueries({ queryKey: ["sessions"] });
      void queryClient.invalidateQueries({ queryKey: moviesKeys.all });
      void refreshSeatMap();
    },
    onError: (error) => {
      const apiError = toApiError(error);
      if (apiError.kind === "conflict") {
        handleContested(apiError.contested);
      } else if (apiError.kind === "rule" && /hold/i.test(apiError.message)) {
        storage.clear(sessionId);
        dispatch({ type: "reset", notice: { message: apiError.message } });
        void refreshSeatMap();
      }
    },
  });

  const holdMutate = useSingleFlightMutate(holdMutation);
  const orderMutate = useSingleFlightMutate(orderMutation);

  const toggleSeat = (seat: Seat) =>
    dispatch({
      type: "toggle-seat",
      seat: { seatId: seat.id, code: seat.code },
      max: options?.maxSeatsPerOrder ?? 3,
    });

  const removeSeat = (seatId: number) => {
    const seat = stateRef.current.selection.find(
      (item) => item.seatId === seatId,
    );
    if (seat) {
      dispatch({
        type: "toggle-seat",
        seat: { seatId: seat.seatId, code: seat.code },
        max: options?.maxSeatsPerOrder ?? 3,
      });
    }
  };

  const setTicketType = (seatId: number, ticketType: TicketTypeSlug) =>
    dispatch({ type: "set-ticket-type", seatId, ticketType });

  const goToCheckout = () => {
    const { hold, selection } = stateRef.current;
    if (selection.length === 0) return;

    if (hold && sameSelection(selection, hold.seats)) {
      dispatch({ type: "go-to", step: "checkout" });
      return;
    }
    holdMutate(undefined);
  };

  const goToSeats = () => dispatch({ type: "go-to", step: "seats" });

  return {
    state,
    session,
    seatMap,
    options,
    remainingMs,
    holdMutation,
    orderMutation,
    submitOrder: orderMutate,
    toggleSeat,
    removeSeat,
    setTicketType,
    goToCheckout,
    goToSeats,
    dismissNotice: () => dispatch({ type: "notice", notice: null }),
  };
}
