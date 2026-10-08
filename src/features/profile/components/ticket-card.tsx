import { format, parse, parseISO, subHours } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { MoviePoster } from "@/features/movies/components/movie-poster";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/price";
import type { Order } from "@/types/api";

const REFUND_CUTOFF_HOURS = 2;

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-overline text-fg-secondary uppercase">{label}</dt>
      <dd className="text-label-m">{value}</dd>
    </div>
  );
}

function getRefundNote(order: Order, upcoming: boolean) {
  if (order.status === "refunded") {
    return order.refundedAt
      ? `Refunded on ${format(parseISO(order.refundedAt), "d MMM yyyy")}`
      : "Refunded";
  }
  if (!upcoming) return "This session has ended";

  const start = parse(
    `${order.session.date} ${order.session.time}`,
    "yyyy-MM-dd HH:mm",
    new Date(),
  );
  const deadline = format(
    subHours(start, REFUND_CUTOFF_HOURS),
    "HH:mm, EEE d MMM",
  );
  return order.isRefundable
    ? `Refundable until ${deadline}`
    : `Refund window closed at ${deadline}`;
}

interface TicketCardProps {
  order: Order;
  upcoming: boolean;
  onRefund: (order: Order) => void;
}

export function TicketCard({ order, upcoming, onRefund }: TicketCardProps) {
  const { session, tickets } = order;
  const canRefund = upcoming && order.isRefundable;
  const refundButton = (
    <Button
      variant="transparent"
      size="sm"
      disabled={!canRefund}
      onClick={() => onRefund(order)}
      className="w-full disabled:bg-tint-white disabled:text-fg disabled:opacity-20"
    >
      Refund
    </Button>
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-[26px] bg-card xl:flex-row">
      <div className="flex min-w-0 flex-1 items-center gap-4.5 px-5 py-6 sm:px-7.5">
        <MoviePoster
          src={session.movie.posterUrl}
          size="w342"
          sizes="100px"
          className="h-33.25 w-25 rounded-[10px]"
        />
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-h2 uppercase">{session.movie.title}</h2>
            <Badge variant="red" size="sm">
              {session.movie.ageRating.code}
            </Badge>
            <span className="text-body-m text-fg-secondary">
              {session.movie.runtimeMinutes} min
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <dl className="flex flex-wrap gap-x-10 gap-y-3">
              <MetaItem
                label="Date"
                value={`${format(parseISO(session.date), "EEE d MMM")} · ${session.time}`}
              />
              <MetaItem
                label="Venue"
                value={`${session.venue.name} · Hall ${session.hall.name}`}
              />
              <MetaItem
                label="Format"
                value={`${session.format.name} · ${session.language.name}`}
              />
            </dl>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-overline text-fg-secondary uppercase">
                Seats
              </span>
              {tickets.map((ticket) => (
                <span
                  key={ticket.id}
                  className="rounded-md bg-tint-white px-2.5 py-1 text-label-s"
                >
                  {ticket.seatCode} · {ticket.ticketType.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-dashed border-raised px-6 py-5 xl:w-75 xl:shrink-0 xl:border-t-0 xl:border-l">
        <div className="flex flex-col gap-0.5">
          <span className="text-overline text-fg-secondary uppercase">
            Order
          </span>
          <span className="text-label-m">#{order.reference}</span>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-label-m text-fg-secondary">Total paid</span>
            <span className="text-h1">{formatPrice(order.totalPrice)}</span>
          </div>
          {upcoming && !order.isRefundable ? (
            <Tooltip
              content={`Refunds close ${REFUND_CUTOFF_HOURS} hours before the session starts.`}
              className="w-full [&>span:first-child]:w-full"
            >
              {refundButton}
            </Tooltip>
          ) : (
            refundButton
          )}
          <p className={cn("text-center text-body-s text-fg-secondary")}>
            {getRefundNote(order, upcoming)}
          </p>
        </div>
      </div>
    </article>
  );
}
