import type { AgeRating } from "@/types/api";
import { Badge } from "./badge";
import { Tooltip } from "./tooltip";

export function AgeRatingBadge({
  rating,
  className,
}: {
  rating: AgeRating;
  className?: string;
}) {
  return (
    <Tooltip content={rating.description} className={className}>
      <Badge variant="red" size="sm">
        {rating.code}
      </Badge>
    </Tooltip>
  );
}
