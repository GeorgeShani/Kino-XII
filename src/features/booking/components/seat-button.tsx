import { cn } from "@/lib/utils/cn";
import type { Seat, SeatState } from "@/types/api";

const HATCH =
  "bg-[repeating-linear-gradient(135deg,rgb(255_255_255/0.1)_0_4px,transparent_4px_8px)]";

const STATE_STYLES: Record<
  Exclude<SeatState, "unavailable">,
  { selected: string; idle: string }
> = {
  available: {
    selected: "bg-red text-white inset-ring-1 inset-ring-page",
    idle: "bg-card text-fg shadow-chip inset-ring-1 inset-ring-fg-disabled enabled:hover:bg-raised",
  },
  sold: {
    selected: "bg-card text-fg-disabled",
    idle: "bg-card text-fg-disabled",
  },
  held: {
    selected: "bg-card text-fg-secondary",
    idle: cn("bg-card text-fg-secondary", HATCH),
  },
};

interface SeatButtonProps {
  seat: Seat;
  state: SeatState;
  selected: boolean;
  onToggle: (seat: Seat) => void;
}

export function SeatButton({
  seat,
  state,
  selected,
  onToggle,
}: SeatButtonProps) {
  if (state === "unavailable") {
    return <span aria-hidden="true" className="size-(--seat) shrink-0" />;
  }

  const styles = STATE_STYLES[state];
  const interactive = state === "available";

  return (
    <button
      type="button"
      disabled={!interactive}
      aria-pressed={interactive ? selected : undefined}
      aria-label={`Seat ${seat.code}${
        state === "sold"
          ? ", sold"
          : state === "held"
            ? ", held by another user"
            : ""
      }`}
      onClick={() => onToggle(seat)}
      className={cn(
        "grid size-(--seat) shrink-0 place-items-center rounded-[10px] text-label-m @min-[44rem]:text-h3",
        "disabled:cursor-not-allowed",
        selected && interactive ? styles.selected : styles.idle,
      )}
    >
      {seat.label}
    </button>
  );
}

export function LegendSwatch({
  kind,
}: {
  kind: "available" | "selected" | "sold" | "held";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 rounded-[5px]",
        kind === "available" && "bg-card inset-ring-1 inset-ring-fg-disabled",
        kind === "selected" && "bg-red",
        kind === "sold" && "bg-card",
        kind === "held" && cn("bg-card", HATCH),
      )}
    />
  );
}
