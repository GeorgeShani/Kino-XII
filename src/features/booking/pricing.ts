import type { TicketType, TicketTypeSlug } from "@/types/api";

export interface SelectedSeat {
  seatId: number;
  code: string;
  ticketType: TicketTypeSlug;
}

const roundMoney = (amount: number) => Math.round(amount * 100) / 100;

export const seatPrice = (basePrice: number, ticketType: TicketType) =>
  roundMoney(basePrice * ticketType.priceRatio);

export function getBookableTicketTypes(
  ticketTypes: TicketType[],
  minAge: number,
) {
  return ticketTypes
    .filter(
      (type) =>
        type.blockedFromRatingAge === null ||
        minAge < type.blockedFromRatingAge,
    )
    .sort((a, b) => a.priceRatio - b.priceRatio);
}

export const ticketTypeLabel = (type: TicketType) =>
  `${type.name} ${Math.round(type.priceRatio * 100)}%`;

export function getSubtotal(
  selection: SelectedSeat[],
  ticketTypes: TicketType[],
  basePrice: number,
) {
  return roundMoney(
    selection.reduce((total, seat) => {
      const type = ticketTypes.find((item) => item.slug === seat.ticketType);
      return total + (type ? seatPrice(basePrice, type) : basePrice);
    }, 0),
  );
}

export function summarizeTickets(
  tickets: { ticketType: { slug: string; name: string } }[],
) {
  const counts = new Map<string, { name: string; count: number }>();

  for (const ticket of tickets) {
    const entry = counts.get(ticket.ticketType.slug) ?? {
      name: ticket.ticketType.name,
      count: 0,
    };
    entry.count += 1;
    counts.set(ticket.ticketType.slug, entry);
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .map(({ name, count }) => `${count} x ${name}`)
    .join(", ");
}

export const sameSelection = (
  selection: SelectedSeat[],
  held: { seatId: number; ticketType: { slug: string } }[],
) =>
  selection.length === held.length &&
  selection.every((seat) =>
    held.some(
      (item) =>
        item.seatId === seat.seatId && item.ticketType.slug === seat.ticketType,
    ),
  );
