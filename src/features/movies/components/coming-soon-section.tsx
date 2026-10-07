"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useComingSoonMovies } from "../hooks";
import { HomeSection, sectionActionStyles } from "./home-section";
import { MovieCardMedium } from "./movie-card-medium";
import { ScrollRow } from "./scroll-row";

const COLLAPSED_COUNT = 4;

export function ComingSoonSection() {
  const { data, isPending, isError, error, refetch } = useComingSoonMovies();
  const [expanded, setExpanded] = useState(false);

  const canExpand = (data?.length ?? 0) > COLLAPSED_COUNT;
  const visible = expanded ? data : data?.slice(0, COLLAPSED_COUNT);

  return (
    <HomeSection
      title="COMING SOON..."
      action={
        canExpand && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className={sectionActionStyles}
          >
            {expanded ? "Show less" : "See all"}
          </button>
        )
      }
    >
      {isPending && (
        <ScrollRow gap="gap-5">
          {Array.from({ length: COLLAPSED_COUNT }, (_, index) => (
            <Skeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
              key={index}
              className="h-40 w-117.5 shrink-0 rounded-[20px]"
            />
          ))}
        </ScrollRow>
      )}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {visible?.length === 0 && (
        <EmptyState
          title="No upcoming films yet"
          description="Announcements will show up here."
        />
      )}
      {visible && visible.length > 0 && (
        <ScrollRow gap="gap-5">
          {visible.map((movie) => (
            <MovieCardMedium key={movie.id} movie={movie} />
          ))}
        </ScrollRow>
      )}
    </HomeSection>
  );
}
