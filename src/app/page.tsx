import { FeaturedHero } from "@/features/movies/components/featured-hero";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-8 pb-4">
      <h1 className="sr-only">Kino XII</h1>
      <FeaturedHero />
    </main>
  );
}
