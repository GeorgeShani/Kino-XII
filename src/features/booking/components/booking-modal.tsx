"use client";

import { format, parseISO } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store";
import { cn } from "@/lib/utils/cn";
import { getSubtotal } from "../pricing";
import { useBookingFlow } from "../use-booking-flow";
import { formatCountdown } from "../use-countdown";
import { CheckoutForm } from "./checkout-form";
import { CheckoutSummary } from "./checkout-summary";
import { Confirmation } from "./confirmation";
import { SeatMap } from "./seat-map";
import { SeatsSidebar } from "./seats-sidebar";
import { StepProgress } from "./step-progress";

interface BookingModalProps {
  sessionId: number;
  onClose: () => void;
}

function HoldTimer({ remainingMs }: { remainingMs: number }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-0.5 rounded-xl bg-card px-3.5 py-2">
      <span className="text-label-s text-fg-secondary">SEATS HELD</span>
      <output className="text-button tabular-nums">
        {formatCountdown(remainingMs)}
      </output>
    </div>
  );
}

function BookingSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-8">
      <Skeleton className="h-11.5 w-80" />
      <div className="flex flex-col gap-5 lg:flex-row">
        <Skeleton className="h-113 flex-1" />
        <Skeleton className="h-113 lg:w-80.25" />
      </div>
    </div>
  );
}

export function BookingModal({ sessionId, onClose }: BookingModalProps) {
  const flow = useBookingFlow(sessionId);
  const user = useAuthStore((state) => state.user);
  const [formValid, setFormValid] = useState(false);

  const { state, session, seatMap, options } = flow;

  if (session.isError || seatMap.isError) {
    return (
      <ErrorState
        error={session.error ?? seatMap.error}
        onRetry={() => {
          void session.refetch();
          void seatMap.refetch();
        }}
      />
    );
  }

  if (!session.data || !seatMap.data || !options) return <BookingSkeleton />;

  const { data: sessionData } = session;
  const { minAge } = sessionData.movie.ageRating;

  if (state.step === "confirmed" && state.order) {
    return <Confirmation order={state.order} onClose={onClose} />;
  }

  const total = state.hold
    ? state.hold.subtotal
    : getSubtotal(state.selection, options.ticketTypes, sessionData.price);
  const maxSeats = options.maxSeatsPerOrder;
  const onCheckout = state.step === "checkout";

  const meta = [
    sessionData.venue.name,
    `Hall ${sessionData.hall.name}`,
    format(parseISO(sessionData.date), "EEEE d MMMM"),
    sessionData.time,
    sessionData.format.name,
    sessionData.language.name,
  ].join(" · ");

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-start justify-between gap-6">
        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="text-h2 uppercase">{sessionData.movie.title}</h2>
          <p className="text-body-s text-fg-secondary">{meta}</p>
        </div>
        {flow.remainingMs !== null && (
          <HoldTimer remainingMs={flow.remainingMs} />
        )}
      </header>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <StepProgress
            step={state.step}
            canCheckout={state.selection.length > 0 || onCheckout}
            onSeats={flow.goToSeats}
            onCheckout={flow.goToCheckout}
          />

          {state.notice && (
            <p
              role="alert"
              className="rounded-xl bg-tint-orange px-4 py-3 text-body-s text-orange"
            >
              {state.notice.message}{" "}
              {state.notice.profileLink && (
                <Link href="/profile" onClick={onClose} className="underline">
                  Go to your profile
                </Link>
              )}
            </p>
          )}

          <div className="grid">
            <div
              inert={onCheckout}
              aria-hidden={onCheckout}
              className={cn(
                "col-start-1 row-start-1",
                onCheckout && "invisible",
              )}
            >
              <SeatMap
                map={seatMap.data}
                selection={state.selection}
                soldCodes={state.soldCodes}
                onToggle={flow.toggleSeat}
              />
            </div>
            {state.hold && (
              <div
                inert={!onCheckout}
                aria-hidden={!onCheckout}
                className={cn(
                  "col-start-1 row-start-1",
                  !onCheckout && "invisible",
                )}
              >
                <CheckoutForm
                  defaults={{
                    fullName: user?.fullName ?? "",
                    email: user?.email ?? "",
                    mobileNumber: user?.mobileNumber ?? "",
                  }}
                  onValidChange={setFormValid}
                  onSubmit={(input, onError) =>
                    flow.orderMutation.mutate(input, { onError })
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="hidden w-px shrink-0 rounded-full bg-card lg:block" />

        <div className="flex flex-col lg:w-80.25 lg:shrink-0">
          {onCheckout ? (
            <CheckoutSummary
              session={sessionData}
              selection={state.selection}
              ticketTypes={options.ticketTypes}
              total={total}
              paying={flow.orderMutation.isPending}
              valid={formValid}
            />
          ) : (
            <SeatsSidebar
              selection={state.selection}
              maxSeats={maxSeats}
              limitHit={state.limitHit}
              basePrice={sessionData.price}
              minAge={minAge}
              ticketTypes={options.ticketTypes}
              total={total}
              loading={flow.holdMutation.isPending}
              onTicketType={flow.setTicketType}
              onRemove={flow.removeSeat}
              onNext={flow.goToCheckout}
            />
          )}
        </div>
      </div>
    </div>
  );
}
