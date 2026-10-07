import type { AgeRating } from "@/types/api";
import { useAuthStore } from "./store";

export function useIsAgeBlocked(rating: Pick<AgeRating, "minAge">) {
  const age = useAuthStore((state) => state.user?.age ?? null);
  return age !== null && age < rating.minAge;
}
