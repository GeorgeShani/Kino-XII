import { format, parseISO } from "date-fns";
import type { SessionWithMovie, TicketType } from "@/types/api";
import { type SelectedSeat, summarizeTickets } from "../pricing";
import { CHECKOUT_FORM_ID } from "./checkout-form";
import { PanelFooter } from "./panel-footer";

interface CheckoutSummaryProps {
  session: SessionWithMovie;
  selection: SelectedSeat[];
  ticketTypes: TicketType[];
  total: number;
  paying: boolean;
  valid: boolean;
}

export function CheckoutSummary({
  session,
  selection,
  ticketTypes,
  total,
  paying,
  valid,
}: CheckoutSummaryProps) {
  const tickets = selection.map((seat) => ({
    ticketType: {
      slug: seat.ticketType,
      name:
        ticketTypes.find((type) => type.slug === seat.ticketType)?.name ??
        seat.ticketType,
    },
  }));

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-1 flex-col gap-3">
        <h3 className="text-button">Summary</h3>
        <div className="flex flex-col gap-2.5 rounded-xl bg-card p-4">
          <p className="text-button">{session.movie.title}</p>
          <p className="text-body-s text-fg-secondary">
            Hall {session.hall.name} ·{" "}
            {format(parseISO(session.date), "EEE d MMM")} · {session.time}
          </p>
          <hr className="h-px border-0 bg-raised" />
          <SummaryRow
            label="Seats"
            value={selection.map((seat) => seat.code).join(", ")}
            strong
          />
          <SummaryRow label="Tickets" value={summarizeTickets(tickets)} />
        </div>
      </div>
      <PanelFooter
        total={total}
        label="Pay: Complete order"
        type="submit"
        form={CHECKOUT_FORM_ID}
        disabled={!valid}
        loading={paying}
      />
    </div>
  );
}

export function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-body-s text-fg-secondary">{label}</span>
      <span className={strong ? "text-label-s" : "text-body-s"}>{value}</span>
    </div>
  );
}
