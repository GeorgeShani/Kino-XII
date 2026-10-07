"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useNowPlayingMovies } from "../hooks";
import { HomeSection, sectionActionStyles } from "./home-section";
import { MovieCardBig } from "./movie-card-big";
import { ScrollRow } from "./scroll-row";

const HOME_LIMIT = 10;

function Content() {
  const { data, isPending, isError, error, refetch } =
    useNowPlayingMovies(HOME_LIMIT);

  if (isPending) {
    return (
      <ScrollRow gap="gap-4.25">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton
            // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
            key={index}
            className="h-113 w-65 shrink-0 rounded-[20px]"
          />
        ))}
      </ScrollRow>
    );
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="Nothing is playing right now"
        description="New films land every week, check back soon."
      />
    );
  }

  return (
    <ScrollRow gap="gap-4.25">
      {data.map((movie) => (
        <MovieCardBig key={movie.id} movie={movie} />
      ))}
    </ScrollRow>
  );
}

export function NowPlayingSection() {
  return (
    <HomeSection
      title="NOW PLAYING"
      action={
        <Link href="/sessions" className={sectionActionStyles}>
          See all
        </Link>
      }
    >
      <Content />
    </HomeSection>
  );
}
