"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedMovies } from "../hooks";
import { HeroCarousel } from "./hero-carousel";

export function FeaturedHero() {
  const { data, isPending, isError, error, refetch } = useFeaturedMovies();

  if (isPending) return <Skeleton className="h-190 rounded-none" />;

  if (isError) {
    return (
      <ErrorState
        error={error}
        onRetry={() => refetch()}
        className="h-190 justify-center"
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="No featured films right now"
        description="Check back soon, or browse what is on today."
        className="h-190 justify-center"
        action={
          <Link
            href="/sessions"
            className={buttonStyles({ variant: "transparent" })}
          >
            Browse sessions
          </Link>
        }
      />
    );
  }

  return <HeroCarousel movies={data} />;
}
