import type { SessionSort, TimeBand } from "@/types/api";

export const SESSION_SORTS = [
  "time_asc",
  "time_desc",
  "price_asc",
  "price_desc",
  "title_asc",
] as const satisfies readonly SessionSort[];

export const TIME_BANDS = [
  "morning",
  "afternoon",
  "evening",
] as const satisfies readonly TimeBand[];

export const DEFAULT_SORT: SessionSort = "time_asc";
export const DAYS_AHEAD = 7;
