import { describe, expect, test } from "bun:test";
import type { Format, Venue } from "@/types/api";
import { getAvailableFormats, pruneFormats } from "./narrowing";

const format = (slug: string): Format => ({
  id: 1,
  slug,
  name: slug,
  priceUplift: 0,
});

const formats = ["standard", "max", "atmos", "motion"].map(format);
const venues: Venue[] = [
  {
    id: 1,
    slug: "vake",
    name: "Vake",
    city: "Tbilisi",
    formats: [format("standard"), format("max")],
  },
  {
    id: 2,
    slug: "batumi",
    name: "Batumi",
    city: "Batumi",
    formats: [format("standard"), format("atmos")],
  },
];

describe("getAvailableFormats", () => {
  test("returns every format when no venue is selected", () => {
    expect(getAvailableFormats(formats, venues, [])).toHaveLength(4);
  });

  test("narrows to the union of the selected venues", () => {
    const slugs = getAvailableFormats(formats, venues, ["vake"]).map(
      (item) => item.slug,
    );
    expect(slugs).toEqual(["standard", "max"]);
  });
});

describe("pruneFormats", () => {
  test("drops selected formats the venues do not offer", () => {
    const available = getAvailableFormats(formats, venues, ["vake"]);
    expect(pruneFormats(["max", "atmos"], available)).toEqual(["max"]);
  });
});
