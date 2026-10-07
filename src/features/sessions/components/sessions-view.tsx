"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { startBooking } from "@/features/booking/start-booking";
import { cn } from "@/lib/utils/cn";
import { getNextDays } from "@/lib/utils/date";
import type { Session } from "@/types/api";
import type { SessionsParams } from "../api";
import { DAYS_AHEAD } from "../constants";
import { countActiveFilters, useSessionFilters } from "../filters";
import { useFilterOptions, useSessions } from "../hooks";
import { getAvailableFormats, pruneFormats } from "../narrowing";
import { FilterSidebar } from "./filter-sidebar";
import { SessionGroup } from "./session-group";
import { SessionsToolbar } from "./sessions-toolbar";

function Divider() {
  return <hr className="h-px border-0 bg-raised" />;
}

function GroupsSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-8">
      {Array.from({ length: 3 }, (_, index) => (
        <Fragment
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
          key={index}
        >
          {index > 0 && <Divider />}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-14 rounded-lg" />
              <Skeleton className="h-10 w-56" />
            </div>
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 5 }, (_, card) => (
                <Skeleton
                  // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
                  key={card}
                  className="h-26 w-63 shrink-0 rounded-2xl"
                />
              ))}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export function SessionsView() {
  const { filters, update, clearFilters, setPage } = useSessionFilters();
  const [, setSessionId] = useQueryState("session", parseAsInteger);
  const { data: options } = useFilterOptions();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const today = getNextDays(DAYS_AHEAD)[0];
  const date = filters.date ?? today;
  const activeCount = countActiveFilters(filters);

  const params: SessionsParams = {
    date,
    venues: filters.venues,
    formats: filters.formats,
    languages: filters.languages,
    bands: filters.bands,
    sort: filters.sort,
    page: filters.page,
  };
  const { data, isPending, isError, error, refetch, isPlaceholderData } =
    useSessions(params);

  const lastPage = data?.meta.lastPage ?? 1;
  const pageOverflow = !isPlaceholderData && filters.page > lastPage;

  useEffect(() => {
    if (pageOverflow) setPage(1);
  }, [pageOverflow, setPage]);

  const handleVenuesChange = (venues: string[]) => {
    const available = options
      ? getAvailableFormats(options.formats, options.venues, venues)
      : [];
    update({
      venues,
      formats: options
        ? pruneFormats(filters.formats, available)
        : filters.formats,
    });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo({ top: 0 });
  };

  const handleSelect = (session: Session) =>
    startBooking(session.id, setSessionId);

  const renderGroups = () => {
    if (isPending || isPlaceholderData) return <GroupsSkeleton />;

    if (isError) {
      return <ErrorState error={error} onRetry={() => refetch()} />;
    }

    if (data.data.length === 0) {
      return (
        <EmptyState
          title="No sessions match your filters"
          description="Try another day or loosen the filters to see more showtimes."
          action={
            activeCount > 0 && (
              <Button variant="transparent" onClick={clearFilters}>
                Clear filters
              </Button>
            )
          }
        />
      );
    }

    return (
      <div className="flex flex-col gap-8">
        {data.data.map((group, index) => (
          <Fragment key={group.movie.id}>
            {index > 0 && <Divider />}
            <SessionGroup group={group} onSelect={handleSelect} />
          </Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:gap-12.75">
      <div className="flex flex-col gap-3 xl:sticky xl:bottom-4 xl:w-80 xl:shrink-0">
        <Button
          variant="transparent"
          className="self-start xl:hidden"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          Filters{activeCount > 0 && ` (${activeCount})`}
        </Button>
        <div className={cn("xl:block", filtersOpen ? "block" : "hidden")}>
          <FilterSidebar
            options={options}
            filters={filters}
            date={date}
            onVenuesChange={handleVenuesChange}
            onFormatsChange={(formats) => update({ formats })}
            onLanguagesChange={(languages) => update({ languages })}
            onBandsChange={(bands) => update({ bands })}
            onDateChange={(next) =>
              update({ date: next === today ? null : next })
            }
            onClear={clearFilters}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-13">
        <div className="flex flex-col gap-6">
          <SessionsToolbar
            totalSessions={
              isPlaceholderData ? undefined : data?.meta.totalSessions
            }
            sorts={options?.sorts ?? []}
            sort={filters.sort}
            onSortChange={(sort) => update({ sort })}
          />
          {renderGroups()}
        </div>
        {data && (
          <Pagination
            page={filters.page}
            pageCount={lastPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
