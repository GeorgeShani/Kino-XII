import type { Seat, SeatMap, SeatSection, SeatState } from "@/types/api";

export const SEAT_SIZE = 52;
export const SEAT_GAP = 8;
export const AISLE_WIDTH = 16;
export const ROW_LABEL_WIDTH = 20;
export const MIN_SEAT_SIZE = 36;

export function getSectionLabel(section: SeatSection) {
  const first = section.rows[0]?.label;
  const last = section.rows[section.rows.length - 1]?.label;
  const range =
    first && last
      ? ` · ROWS ${first === last ? first : `${first}-${last}`}`
      : "";
  return `${section.name.toUpperCase()}${range}`;
}

function getWidestRow(map: SeatMap) {
  let widest = { seats: 1, aisles: 0, units: 1 };

  for (const section of map.sections) {
    for (const row of section.rows) {
      const aisles = row.seats.filter((seat) => seat.aisleAfter).length;
      const units = row.seats.length + aisles * 0.5;
      if (units > widest.units) {
        widest = { seats: row.seats.length, aisles, units };
      }
    }
  }

  return widest;
}

export function getSeatSizeCss(map: SeatMap) {
  const { seats, aisles } = getWidestRow(map);
  const fixed =
    ROW_LABEL_WIDTH +
    SEAT_GAP +
    (seats - 1) * SEAT_GAP +
    aisles * (AISLE_WIDTH + SEAT_GAP * 2) -
    aisles * SEAT_GAP;
  return `clamp(${MIN_SEAT_SIZE}px, calc((100cqw - ${fixed}px) / ${seats}), ${SEAT_SIZE}px)`;
}

export function resolveSeatState(
  seat: Seat,
  soldCodes: ReadonlySet<string>,
): SeatState {
  if (soldCodes.has(seat.code)) return "sold";
  return seat.state === "held" && seat.isMine ? "available" : seat.state;
}
