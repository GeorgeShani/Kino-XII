import { addDays, format, parseISO } from "date-fns";

const ISO_DATE = "yyyy-MM-dd";

export const toIsoDate = (date: Date) => format(date, ISO_DATE);

export function getNextDays(count: number, from = new Date()) {
  return Array.from({ length: count }, (_, index) =>
    toIsoDate(addDays(from, index)),
  );
}

export const formatWeekday = (isoDate: string) =>
  format(parseISO(isoDate), "EEE");

export const formatDayOfMonth = (isoDate: string) =>
  format(parseISO(isoDate), "d");
