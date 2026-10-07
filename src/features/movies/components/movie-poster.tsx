import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { tmdbImage } from "@/lib/utils/tmdb-image";

interface MoviePosterProps {
  src: string | null;
  size: "w185" | "w342" | "w500" | "w780";
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function MoviePoster({
  src,
  size,
  sizes,
  priority,
  className,
}: MoviePosterProps) {
  return (
    <div
      className={cn("relative shrink-0 overflow-hidden bg-raised", className)}
    >
      {src && (
        <Image
          src={tmdbImage(src, size)}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      )}
    </div>
  );
}
