"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { DayPicker } from "@/components/ui/day-picker";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsAgeBlocked } from "@/features/auth/age-gate";
import { startBooking } from "@/features/booking/start-booking";
import { getNextDays } from "@/lib/utils/date";
import type { MovieDetail, Session } from "@/types/api";
import { movieSessionsQuery } from "../../hooks";
import { NotifyButton } from "../notify-button";
import { VenueSessionsGroup } from "./venue-sessions";

const DAYS_AHEAD = 7;

function ComingSoonNotice({ movie }: { movie: MovieDetail }) {
  return (
    <EmptyState
      title="Not in cinemas yet"
      description={`Sessions open after the premiere on ${format(parseISO(movie.releaseDate), "d MMMM yyyy")}. We can let you know when tickets go on sale.`}
      action={<NotifyButton slug={movie.slug} notified={movie.isNotified} />}
      className="items-start px-0 text-left"
    />
  );
}

function SessionsSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-33.25 w-113.5 rounded-[18px]" />
    </div>
  );
}

export function SessionsSection({ movie }: { movie: MovieDetail }) {
  const [dateParam, setDateParam] = useQueryState("date", parseAsString);
  const [sessionId, setSessionId] = useQueryState("session", parseAsInteger);

  const days = getNextDays(DAYS_AHEAD);
  const available = new Set(movie.availableDates);
  const bookableDays = days.filter((day) => available.has(day));
  const date =
    dateParam && bookableDays.includes(dateParam)
      ? dateParam
      : (bookableDays[0] ?? null);

  const dayQueries = useQueries({
    queries: bookableDays.map((day) => movieSessionsQuery(movie.slug, day)),
  });
  const weekTotal = dayQueries.reduce(
    (total, query) =>
      total +
      (query.data?.reduce((sum, group) => sum + group.sessions.length, 0) ?? 0),
    0,
  );
  const weekLoaded = dayQueries.every((query) => query.isSuccess);

  const selectedDay = useQuery({
    ...movieSessionsQuery(movie.slug, date ?? ""),
    enabled: date !== null,
  });

  const ageBlocked = useIsAgeBlocked(movie.ageRating);

  const handleSelect = (session: Session) =>
    startBooking(session.id, setSessionId);

  const renderSessions = () => {
    if (date === null) {
      return (
        <EmptyState
          title="No upcoming sessions"
          description="There are no showings in the next seven days. Check back soon."
          className="items-start px-0 text-left"
        />
      );
    }

    if (selectedDay.isPending) return <SessionsSkeleton />;

    if (selectedDay.isError) {
      return (
        <ErrorState
          error={selectedDay.error}
          onRetry={() => selectedDay.refetch()}
          className="items-start px-0 text-left"
        />
      );
    }

    if (selectedDay.data.length === 0) {
      return (
        <EmptyState
          title="No sessions on this day"
          description="Pick another day to see showtimes."
          className="items-start px-0 text-left"
        />
      );
    }

    return selectedDay.data.map((group) => (
      <VenueSessionsGroup
        key={group.venue.id}
        group={group}
        selectedSessionId={sessionId}
        ageBlocked={ageBlocked}
        onSelect={handleSelect}
      />
    ));
  };

  if (movie.isComingSoon) return <ComingSoonNotice movie={movie} />;

  return (
    <div className="flex min-w-0 flex-col gap-6.75">
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.75">
          <h2 className="text-h2">Sessions</h2>
          <p className="min-h-4 text-body-s text-fg-secondary">
            {weekLoaded &&
              `${weekTotal} ${weekTotal === 1 ? "session" : "sessions"} over the next seven days`}
          </p>
        </div>
        <DayPicker
          days={days}
          value={date ?? ""}
          onChange={setDateParam}
          isDisabled={(day) => !available.has(day)}
        />
      </div>

      {ageBlocked && (
        <p
          role="alert"
          className="rounded-xl bg-tint-red px-4 py-3 text-body-s text-red"
        >
          This film is rated {movie.ageRating.code}. Your account does not meet
          the minimum age of {movie.ageRating.minAge}, so booking is
          unavailable.
        </p>
      )}

      {renderSessions()}
    </div>
  );
}
