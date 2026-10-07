import { CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/price";
import type { TicketType, TicketTypeSlug } from "@/types/api";
import {
  getBookableTicketTypes,
  type SelectedSeat,
  seatPrice,
  ticketTypeLabel,
} from "../pricing";
import { PanelFooter } from "./panel-footer";

interface SeatCardProps {
  seat: SelectedSeat;
  basePrice: number;
  ticketTypes: TicketType[];
  onTicketType: (seatId: number, ticketType: TicketTypeSlug) => void;
  onRemove: () => void;
}

function SeatCard({
  seat,
  basePrice,
  ticketTypes,
  onTicketType,
  onRemove,
}: SeatCardProps) {
  const current = ticketTypes.find((type) => type.slug === seat.ticketType);

  return (
    <li className="flex flex-col gap-3 rounded-2xl bg-card p-3.75">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-3">
          <span className="text-body-s text-fg-secondary">Seat</span>
          <span className="text-label-s">{seat.code}</span>
        </span>
        <span className="flex items-center gap-3 text-label-s">
          {current ? formatPrice(seatPrice(basePrice, current), false) : ""}
          <button
            type="button"
            aria-label={`Remove seat ${seat.code}`}
            onClick={onRemove}
            className="grid size-4 place-items-center text-fg-secondary transition-colors duration-300 ease-out hover:text-fg"
          >
            <CloseIcon className="size-4" />
          </button>
        </span>
      </div>
      <hr className="h-px border-0 bg-raised" />
      <div
        role="radiogroup"
        aria-label={`Ticket type for ${seat.code}`}
        className="flex gap-2"
      >
        {ticketTypes.map((type) => {
          const selected = type.slug === seat.ticketType;
          return (
            // biome-ignore lint/a11y/useSemanticElements: styled chip acts as a radio option
            <button
              key={type.slug}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onTicketType(seat.seatId, type.slug)}
              className={cn(
                "h-8 flex-1 rounded-full px-2 text-body-s whitespace-nowrap transition-colors duration-300 ease-out",
                selected
                  ? "bg-red text-white"
                  : "bg-raised text-fg hover:bg-fg-disabled",
              )}
            >
              {ticketTypeLabel(type)}
            </button>
          );
        })}
      </div>
    </li>
  );
}

interface SeatsSidebarProps {
  selection: SelectedSeat[];
  maxSeats: number;
  limitHit: boolean;
  basePrice: number;
  minAge: number;
  ticketTypes: TicketType[];
  total: number;
  loading: boolean;
  onTicketType: (seatId: number, ticketType: TicketTypeSlug) => void;
  onRemove: (seatId: number) => void;
  onNext: () => void;
}

export function SeatsSidebar({
  selection,
  maxSeats,
  limitHit,
  basePrice,
  minAge,
  ticketTypes,
  total,
  loading,
  onTicketType,
  onRemove,
  onNext,
}: SeatsSidebarProps) {
  const bookable = getBookableTicketTypes(ticketTypes, minAge);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <h3 className="text-button">Your seats · Max {maxSeats}</h3>
        {selection.length === 0 || limitHit ? (
          <p
            className={cn(
              "text-body-s",
              limitHit ? "text-red" : "text-fg-secondary",
            )}
          >
            {limitHit
              ? `You can pick up to ${maxSeats} seats per order.`
              : `Pick up to ${maxSeats} seats from the map. Each seat can carry its own ticket type.`}
          </p>
        ) : null}
        <ul className="flex min-h-0 flex-col gap-3 overflow-y-auto">
          {selection.map((seat) => (
            <SeatCard
              key={seat.seatId}
              seat={seat}
              basePrice={basePrice}
              ticketTypes={bookable}
              onTicketType={onTicketType}
              onRemove={() => onRemove(seat.seatId)}
            />
          ))}
        </ul>
      </div>
      <PanelFooter
        total={total}
        label="Next: Checkout"
        disabled={selection.length === 0}
        loading={loading}
        onClick={onNext}
      />
    </div>
  );
}
