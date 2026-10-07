import type { Metadata } from "next";
import { MovieDetail } from "@/features/movies/components/detail/movie-detail";
import { API_URL } from "@/lib/config";

export async function generateMetadata({
  params,
}: PageProps<"/movies/[slug]">): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await fetch(`${API_URL}/movies/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return { title: "Film not found" };

    const { data } = await response.json();
    return { title: data.title, description: data.synopsis };
  } catch {
    return {};
  }
}

export default async function MoviePage({
  params,
}: PageProps<"/movies/[slug]">) {
  const { slug } = await params;

  return (
    <main className="flex flex-1 flex-col gap-8.5 pb-27.5">
      <MovieDetail slug={slug} />
    </main>
  );
}
