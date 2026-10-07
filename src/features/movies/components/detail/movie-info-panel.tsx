import { format, parseISO } from "date-fns";
import { formatPrice } from "@/lib/utils/price";
import type { MovieDetail } from "@/types/api";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.75">
      <dt className="text-label-s text-fg-secondary uppercase">{label}</dt>
      <dd className="text-label-m">{value}</dd>
    </div>
  );
}

function ratingNote({ ageRating }: MovieDetail) {
  return ageRating.minAge > 0
    ? `Not recommended for under-${ageRating.minAge}s. Tickets require an account aged ${ageRating.minAge} or over.`
    : ageRating.description;
}

export function MovieInfoPanel({ movie }: { movie: MovieDetail }) {
  const rows = [
    { label: "Director", value: movie.director },
    { label: "Main cast", value: movie.cast },
    { label: "Duration", value: `${movie.runtimeMinutes} minutes` },
    {
      label: "Release date",
      value: format(parseISO(movie.releaseDate), "d MMMM yyyy"),
    },
    {
      label: "Formats",
      value: movie.formats.map((item) => item.name).join(", "),
    },
    { label: "From", value: formatPrice(movie.fromPrice, false) },
  ].filter((row): row is { label: string; value: string } =>
    Boolean(row.value),
  );

  return (
    <aside className="flex flex-col gap-4.25 rounded-[20px] px-6.5">
      <h2 className="text-h2">Details</h2>
      <dl className="flex flex-col gap-4.25">
        {rows.map((row) => (
          <InfoRow key={row.label} {...row} />
        ))}
      </dl>
      <div className="flex flex-col gap-1.75 rounded-xl bg-tint-orange px-3.25 py-2.25 text-orange">
        <p className="text-label-s uppercase">Rating note</p>
        <p className="flex gap-1.75 text-body-s">
          <span className="text-label-s">{movie.ageRating.code}</span>
          {ratingNote(movie)}
        </p>
      </div>
    </aside>
  );
}
