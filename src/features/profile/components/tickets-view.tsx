"use client";

import Link from "next/link";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useState } from "react";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { TicketIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import type { Order } from "@/types/api";
import type { TicketFilter } from "../api";
import { useTickets } from "../hooks";
import { RefundModal } from "./refund-modal";
import { TicketCard } from "./ticket-card";

const FILTERS = ["upcoming", "past"] as const;

const EMPTY_COPY: Record<TicketFilter, { title: string; description: string }> =
  {
    upcoming: {
      title: "No upcoming tickets",
      description: "Book a session and your tickets will show up here.",
    },
    past: {
      title: "No past tickets yet",
      description: "Tickets for sessions that have run will appear here.",
    },
  };

export function TicketsView() {
  const [filterParam, setFilter] = useQueryState(
    "filter",
    parseAsStringLiteral(FILTERS).withDefault("upcoming"),
  );
  const [refunding, setRefunding] = useState<Order | null>(null);

  const upcoming = useTickets("upcoming");
  const past = useTickets("past");
  const active = filterParam === "upcoming" ? upcoming : past;

  const renderList = () => {
    if (active.isPending) {
      return (
        <div aria-hidden="true" className="flex flex-col gap-5">
          {[0, 1].map((key) => (
            <Skeleton key={key} className="h-45.75 rounded-[26px]" />
          ))}
        </div>
      );
    }

    if (active.isError) {
      return (
        <ErrorState error={active.error} onRetry={() => active.refetch()} />
      );
    }

    if (active.data.length === 0) {
      return (
        <EmptyState
          icon={<TicketIcon />}
          {...EMPTY_COPY[filterParam]}
          action={
            filterParam === "upcoming" && (
              <Link
                href="/sessions"
                className={buttonStyles({ variant: "transparent" })}
              >
                Browse sessions
              </Link>
            )
          }
        />
      );
    }

    return (
      <div className="flex flex-col gap-5">
        {active.data.map((order) => (
          <TicketCard
            key={order.id}
            order={order}
            upcoming={filterParam === "upcoming"}
            onRefund={setRefunding}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <Tabs
        label="Ticket filter"
        items={[
          {
            value: "upcoming",
            label: "Upcoming",
            count: upcoming.data?.length,
          },
          { value: "past", label: "Past", count: past.data?.length },
        ]}
        value={filterParam}
        onChange={setFilter}
        className="self-start"
      />
      {renderList()}
      <RefundModal order={refunding} onClose={() => setRefunding(null)} />
    </div>
  );
}
