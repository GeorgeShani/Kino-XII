import { TicketIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/price";
import type { Session } from "@/types/api";

const LOW_SEATS_THRESHOLD = 5;
const NOTCH_MASK = [
  "radial-gradient(circle 7px at 124px 0, transparent 98%, #000)",
  "radial-gradient(circle 7px at 124px 100%, transparent 98%, #000)",
].join(",");

interface SessionTicketProps {
  session: Session;
  selected: boolean;
  disabled: boolean;
  onSelect: (session: Session) => void;
}

export function SessionTicket({
  session,
  selected,
  disabled,
  onSelect,
}: SessionTicketProps) {
  const unavailable = disabled || session.isSoldOut;
  const lowSeats = session.seatsLeft <= LOW_SEATS_THRESHOLD;

  return (
    <div className="drop-shadow-[0_1px_2px_var(--color-shadow)]">
      <button
        type="button"
        disabled={unavailable}
        aria-pressed={selected}
        aria-label={`${session.time}, ${session.format.name}, ${session.language.name}, ${session.hall.name}`}
        onClick={() => onSelect(session)}
        style={{ maskImage: NOTCH_MASK, maskComposite: "intersect" }}
        className={cn(
          "relative flex h-20.25 w-51.75 rounded-xl text-left transition-[background-color,box-shadow,filter] duration-300 ease-out",
          "disabled:cursor-not-allowed disabled:opacity-40",
          selected
            ? "bg-card inset-ring-1 inset-ring-red"
            : "bg-page enabled:hover:brightness-125",
        )}
      >
        <span className="flex w-31 flex-col items-center justify-center gap-2 py-3.75">
          <span className="text-h2">{session.time}</span>
          <span className="flex items-center gap-1.5">
            <span className="text-body-s text-fg-secondary">
              {session.language.code}
            </span>
            <span className="rounded-full bg-card px-3 py-1 text-label-s">
              {session.format.name}
            </span>
          </span>
        </span>

        <span
          aria-hidden="true"
          className="absolute top-2.75 left-31 h-14.75 w-[1.5px] bg-[repeating-linear-gradient(to_bottom,#fff_0_3px,transparent_3px_7px)]"
        />

        <span className="flex w-20.75 flex-col items-center justify-center gap-2 px-3.75 py-2.5">
          {session.isSoldOut ? (
            <span className="text-body-s whitespace-nowrap text-fg-secondary">
              Sold out
            </span>
          ) : (
            <>
              <span className="text-h3 whitespace-nowrap text-red">
                {formatPrice(session.price)}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-body-s whitespace-nowrap",
                  lowSeats ? "text-red" : "text-fg-secondary",
                )}
              >
                <TicketIcon className="size-3" />
                {session.seatsLeft} left
              </span>
            </>
          )}
        </span>
      </button>
    </div>
  );
}
