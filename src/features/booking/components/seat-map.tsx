import type { CSSProperties } from "react";
import type { Seat, SeatMap as SeatMapData } from "@/types/api";
import type { SelectedSeat } from "../pricing";
import {
  getSeatSizeCss,
  getSectionLabel,
  resolveSeatState,
} from "../seat-layout";
import { LegendSwatch, SeatButton } from "./seat-button";

const LEGEND = [
  { kind: "available", label: "Available" },
  { kind: "selected", label: "Selected" },
  { kind: "sold", label: "Sold" },
  { kind: "held", label: "Held by another user" },
] as const;

interface SeatMapProps {
  map: SeatMapData;
  selection: SelectedSeat[];
  soldCodes: string[];
  onToggle: (seat: Seat) => void;
}

export function SeatMap({ map, selection, soldCodes, onToggle }: SeatMapProps) {
  const sold = new Set(soldCodes);
  const selectedIds = new Set(selection.map((seat) => seat.seatId));

  return (
    <div
      className="@container flex flex-col items-center gap-8"
      style={{ "--seat": getSeatSizeCss(map) } as CSSProperties}
    >
      <div className="flex w-full flex-col items-center gap-2.5 px-5">
        <div className="flex h-7.5 w-full items-center justify-center rounded-b-[20px] bg-raised text-label-s">
          SCREEN
        </div>
      </div>

      <div className="flex max-w-full flex-col gap-6 overflow-x-auto">
        {map.sections.map((section) => (
          <section
            key={section.name}
            aria-label={getSectionLabel(section)}
            className="mx-auto flex w-fit flex-col gap-6"
          >
            <h3 className="text-label-s text-fg-secondary">
              {getSectionLabel(section)}
            </h3>
            <div className="flex flex-col gap-2.5">
              {section.rows.map((row) => (
                <div key={row.label} className="flex items-center gap-2">
                  <span className="grid h-8 w-5 shrink-0 place-items-center text-label-s">
                    {row.label}
                  </span>
                  {row.seats.map((seat) => (
                    <SeatWithAisle
                      key={seat.id}
                      seat={seat}
                      selected={selectedIds.has(seat.id)}
                      state={resolveSeatState(seat, sold)}
                      onToggle={onToggle}
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {LEGEND.map((item) => (
          <li
            key={item.kind}
            className="flex items-center gap-2 text-body-s text-fg-secondary"
          >
            <LegendSwatch kind={item.kind} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SeatWithAisle({
  seat,
  selected,
  state,
  onToggle,
}: {
  seat: Seat;
  selected: boolean;
  state: Seat["state"];
  onToggle: (seat: Seat) => void;
}) {
  return (
    <>
      <SeatButton
        seat={seat}
        state={state}
        selected={selected}
        onToggle={onToggle}
      />
      {seat.aisleAfter && <span aria-hidden="true" className="w-4 shrink-0" />}
    </>
  );
}
