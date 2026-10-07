import type { Format, Venue } from "@/types/api";

export function getAvailableFormats(
  formats: Format[],
  venues: Venue[],
  selectedVenueSlugs: string[],
) {
  if (selectedVenueSlugs.length === 0) return formats;

  const offered = new Set(
    venues
      .filter((venue) => selectedVenueSlugs.includes(venue.slug))
      .flatMap((venue) => venue.formats.map((format) => format.slug)),
  );

  return formats.filter((format) => offered.has(format.slug));
}

export function pruneFormats(
  selectedFormatSlugs: string[],
  availableFormats: Format[],
) {
  const available = new Set(availableFormats.map((format) => format.slug));
  return selectedFormatSlugs.filter((slug) => available.has(slug));
}
