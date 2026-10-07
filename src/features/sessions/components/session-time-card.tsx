import { TicketIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/price";
import type { Session } from "@/types/api";

const LOW_SEATS_THRESHOLD = 5;

interface SessionTimeCardProps {
  session: Session;
  ageBlocked: boolean;
  onSelect: (session: Session) => void;
}

export function SessionTimeCard({
  session,
  ageBlocked,
  onSelect,
}: SessionTimeCardProps) {
  const lowSeats = session.seatsLeft <= LOW_SEATS_THRESHOLD;

  return (
    <button
      type="button"
      disabled={session.isSoldOut || ageBlocked}
      onClick={() => onSelect(session)}
      className="flex h-26 w-63 shrink-0 flex-col gap-3 rounded-2xl bg-card p-3.75 text-left disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-h3">{session.time}</span>
        <span className="rounded-full bg-raised px-2.5 py-1.25 text-label-s">
          {session.format.name}
        </span>
      </span>

      <span className="flex items-end justify-between gap-2">
        <span className="flex min-w-0 flex-col gap-2.5">
          <span className="truncate text-body-s text-fg-secondary">
            {session.language.name}
          </span>
          <span className="truncate text-label-s">
            {session.venue.name} · Hall {session.hall.name}
          </span>
        </span>

        <span className="flex shrink-0 flex-col items-end gap-2.5">
          {session.isSoldOut ? (
            <span className="text-body-s text-fg-secondary">Sold out</span>
          ) : (
            <span
              className={cn(
                "flex items-center gap-1 text-body-s",
                lowSeats ? "text-red" : "text-green",
              )}
            >
              <TicketIcon className="size-3" />
              {session.seatsLeft} left
            </span>
          )}
          <span className="text-button">
            {formatPrice(session.price, false)}
          </span>
        </span>
      </span>
    </button>
  );
}
