import { format, parseISO } from "date-fns";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { MoviePoster } from "@/features/movies/components/movie-poster";
import { formatPrice } from "@/lib/utils/price";
import type { Order } from "@/types/api";
import { summarizeTickets } from "../pricing";
import { SummaryRow } from "./checkout-summary";

export function Confirmation({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const { session } = order;

  return (
    <div className="flex min-h-133.75 flex-col items-center justify-center gap-4 py-6 text-center motion-safe:animate-[step-in_300ms_ease-out]">
      <span className="grid size-14 place-items-center rounded-full bg-green text-page">
        <CheckIcon className="size-7 [&_path]:stroke-[2.5]" />
      </span>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-h1">Booking confirmed!</h2>
        <p className="max-w-80 text-body-m text-fg-secondary">
          Your tickets are ready. We&apos;ve sent the confirmation to your
          email.
        </p>
      </div>

      <span className="rounded-full bg-raised px-9 py-1.5 text-label-s">
        ORDER #{order.reference}
      </span>

      <div className="flex w-full max-w-168.25 flex-col gap-3 rounded-xl bg-card p-5 text-left">
        <div className="flex items-center gap-3">
          <MoviePoster
            src={session.movie.posterUrl}
            size="w185"
            sizes="48px"
            className="h-16 w-12 rounded-lg"
          />
          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="truncate text-button">{session.movie.title}</p>
            <p className="text-body-s text-fg-secondary">
              {session.venue.name} · Hall {session.hall.name} ·{" "}
              {format(parseISO(session.date), "EEE d MMM")} · {session.time}
            </p>
          </div>
        </div>
        <hr className="h-px border-0 bg-raised" />
        <SummaryRow
          label="Seats"
          value={order.tickets.map((ticket) => ticket.seatCode).join(", ")}
          strong
        />
        <SummaryRow label="Tickets" value={summarizeTickets(order.tickets)} />
        <hr className="h-px border-0 bg-raised" />
        <div className="flex items-center justify-between">
          <span className="text-body-s text-fg-secondary">TOTAL PAID</span>
          <span className="text-h3">{formatPrice(order.totalPrice)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/profile/tickets"
          onClick={onClose}
          className={buttonStyles({ variant: "primary", size: "sm" })}
        >
          View my tickets
        </Link>
        <Link
          href="/"
          onClick={onClose}
          className={buttonStyles({ variant: "transparent", size: "sm" })}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
