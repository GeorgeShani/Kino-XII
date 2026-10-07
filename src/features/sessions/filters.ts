"use client";

import {
  createParser,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { DEFAULT_SORT, SESSION_SORTS, TIME_BANDS } from "./constants";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const parseAsIsoDateString = createParser({
  parse: (value) => (ISO_DATE.test(value) ? value : null),
  serialize: (value: string) => value,
});

const slugList = parseAsArrayOf(parseAsString).withDefault([]);

export const sessionFilterParsers = {
  venues: slugList,
  formats: slugList,
  languages: slugList,
  bands: parseAsArrayOf(parseAsStringLiteral(TIME_BANDS)).withDefault([]),
  date: parseAsIsoDateString,
  sort: parseAsStringLiteral(SESSION_SORTS).withDefault(DEFAULT_SORT),
  page: parseAsInteger.withDefault(1),
};

export type SessionFilters = {
  [Key in keyof typeof sessionFilterParsers]: ReturnType<
    (typeof sessionFilterParsers)[Key]["parseServerSide"]
  >;
};

export type ListFilterKey = "venues" | "formats" | "languages" | "bands";

export const countActiveFilters = (
  filters: Pick<SessionFilters, ListFilterKey>,
) =>
  filters.venues.length +
  filters.formats.length +
  filters.languages.length +
  filters.bands.length;

export function useSessionFilters() {
  const [filters, setFilters] = useQueryStates(sessionFilterParsers, {
    history: "push",
    scroll: false,
  });

  const update = (patch: Partial<Omit<SessionFilters, "page">>) =>
    setFilters({ ...patch, page: null });

  const clearFilters = () =>
    setFilters({
      venues: null,
      formats: null,
      languages: null,
      bands: null,
      page: null,
    });

  const setPage = (page: number) => setFilters({ page });

  return { filters, update, clearFilters, setPage };
}
