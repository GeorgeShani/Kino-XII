import type { Order, SeatHold, TicketTypeSlug } from "@/types/api";
import type { SelectedSeat } from "./pricing";

export type BookingStep = "seats" | "checkout" | "confirmed";

export interface BookingNotice {
  message: string;
  profileLink?: boolean;
}

export interface BookingState {
  step: BookingStep;
  selection: SelectedSeat[];
  hold: SeatHold | null;
  soldCodes: string[];
  notice: BookingNotice | null;
  order: Order | null;
  limitHit: boolean;
}

export type BookingAction =
  | { type: "toggle-seat"; seat: Omit<SelectedSeat, "ticketType">; max: number }
  | { type: "set-ticket-type"; seatId: number; ticketType: TicketTypeSlug }
  | { type: "held"; hold: SeatHold }
  | { type: "restored"; hold: SeatHold }
  | { type: "go-to"; step: BookingStep }
  | { type: "reset"; notice: BookingNotice }
  | { type: "contested"; codes: string[]; notice: BookingNotice }
  | { type: "notice"; notice: BookingNotice | null }
  | { type: "ordered"; order: Order };

export const initialBookingState: BookingState = {
  step: "seats",
  selection: [],
  hold: null,
  soldCodes: [],
  notice: null,
  order: null,
  limitHit: false,
};

const fromHold = (hold: SeatHold): SelectedSeat[] =>
  hold.seats.map((seat) => ({
    seatId: seat.seatId,
    code: seat.code,
    ticketType: seat.ticketType.slug,
  }));

export function bookingReducer(
  state: BookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case "toggle-seat": {
      const exists = state.selection.some(
        (seat) => seat.seatId === action.seat.seatId,
      );
      if (exists) {
        return {
          ...state,
          limitHit: false,
          selection: state.selection.filter(
            (seat) => seat.seatId !== action.seat.seatId,
          ),
        };
      }
      if (state.selection.length >= action.max) {
        return { ...state, limitHit: true };
      }
      return {
        ...state,
        limitHit: false,
        notice: null,
        selection: [
          ...state.selection,
          { ...action.seat, ticketType: "adult" },
        ],
      };
    }
    case "set-ticket-type":
      return {
        ...state,
        limitHit: false,
        selection: state.selection.map((seat) =>
          seat.seatId === action.seatId
            ? { ...seat, ticketType: action.ticketType }
            : seat,
        ),
      };
    case "held":
      return { ...state, hold: action.hold, step: "checkout", notice: null };
    case "restored":
      return { ...state, hold: action.hold, selection: fromHold(action.hold) };
    case "go-to":
      return { ...state, step: action.step };
    case "reset":
      return {
        ...state,
        step: "seats",
        selection: [],
        hold: null,
        notice: action.notice,
        limitHit: false,
      };
    case "contested":
      return {
        ...state,
        step: "seats",
        hold: null,
        soldCodes: [...new Set([...state.soldCodes, ...action.codes])],
        selection: state.selection.filter(
          (seat) => !action.codes.includes(seat.code),
        ),
        notice: action.notice,
      };
    case "notice":
      return { ...state, notice: action.notice };
    case "ordered":
      return { ...state, order: action.order, step: "confirmed", hold: null };
  }
}
