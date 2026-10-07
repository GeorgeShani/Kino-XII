"use client";

import { useRecentlyViewed } from "../recently-viewed";
import { HomeSection, SectionDivider } from "./home-section";
import { MovieCardSmall } from "./movie-card-small";
import { ScrollRow } from "./scroll-row";

export function RecentlyViewedSection() {
  const movies = useRecentlyViewed();
  if (movies.length === 0) return null;

  return (
    <>
      <div className="pt-2.25">
        <HomeSection title="Recently viewed">
          <ScrollRow gap="gap-5">
            {movies.map((movie) => (
              <MovieCardSmall key={movie.id} movie={movie} />
            ))}
          </ScrollRow>
        </HomeSection>
      </div>
      <SectionDivider />
    </>
  );
}
