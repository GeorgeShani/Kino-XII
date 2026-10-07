"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { isApiError, toApiError } from "@/lib/api/errors";
import { useMovie } from "../../hooks";
import { addRecentlyViewed } from "../../recently-viewed";
import { MovieHero } from "./movie-hero";
import { MovieInfoPanel } from "./movie-info-panel";
import { SessionsSection } from "./sessions-section";

const STATE_CLASSES = "min-h-120 justify-center pt-32";

function DetailSkeleton() {
  return (
    <>
      <Skeleton className="h-141.75 rounded-none" />
      <div className="flex flex-col gap-2.5 px-4 sm:px-8 xl:flex-row xl:px-12.75">
        <div className="flex flex-1 flex-col gap-6.75">
          <Skeleton className="h-12 w-72" />
          <div className="flex gap-1.75">
            {Array.from({ length: 7 }, (_, index) => (
              <Skeleton
                // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
                key={index}
                className="size-20 rounded-2xl"
              />
            ))}
          </div>
          <Skeleton className="h-33.25 w-113.5 rounded-[18px]" />
        </div>
        <Skeleton className="h-134.75 w-full rounded-[20px] xl:w-110.25" />
      </div>
    </>
  );
}

export function MovieDetail({ slug }: { slug: string }) {
  const { data: movie, isPending, isError, error, refetch } = useMovie(slug);

  useEffect(() => {
    if (movie) addRecentlyViewed(movie);
  }, [movie]);

  if (isPending) return <DetailSkeleton />;

  if (isError && isApiError(error, "not-found")) {
    return (
      <EmptyState
        title="We couldn't find that film"
        description="It may have left cinemas, or the link is out of date."
        className={STATE_CLASSES}
        action={
          <Link href="/" className={buttonStyles({ variant: "transparent" })}>
            Back to home
          </Link>
        }
      />
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={toApiError(error)}
        onRetry={() => refetch()}
        className={STATE_CLASSES}
      />
    );
  }

  return (
    <>
      <MovieHero movie={movie} />
      <div className="flex flex-col gap-8 px-4 pb-6.5 sm:px-8 xl:flex-row xl:gap-2.5 xl:px-12.75">
        <div className="min-w-0 flex-1">
          <SessionsSection movie={movie} />
        </div>
        <div className="xl:w-110.25 xl:shrink-0">
          <MovieInfoPanel movie={movie} />
        </div>
      </div>
    </>
  );
}
