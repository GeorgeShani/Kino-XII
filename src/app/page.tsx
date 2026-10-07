import { ComingSoonSection } from "@/features/movies/components/coming-soon-section";
import { FeaturedHero } from "@/features/movies/components/featured-hero";
import { SectionDivider } from "@/features/movies/components/home-section";
import { NowPlayingSection } from "@/features/movies/components/now-playing-section";
import { RecentlyViewedSection } from "@/features/movies/components/recently-viewed-section";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-8">
      <h1 className="sr-only">Kino XII</h1>
      <FeaturedHero />
      <div className="flex flex-col gap-10">
        <RecentlyViewedSection />
        <NowPlayingSection />
        <SectionDivider />
        <ComingSoonSection />
      </div>
    </main>
  );
}
