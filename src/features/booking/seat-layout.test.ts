import { describe, expect, test } from "bun:test";
import type { Seat } from "@/types/api";
import { resolveSeatState } from "./seat-layout";

const seat = (overrides: Partial<Seat>): Seat => ({
  id: 1,
  code: "A1",
  label: "1",
  state: "available",
  aisleAfter: false,
  isMine: false,
  ...overrides,
});

describe("resolveSeatState", () => {
  test("keeps the state sent by the API", () => {
    expect(resolveSeatState(seat({ state: "sold" }), new Set())).toBe("sold");
    expect(resolveSeatState(seat({ state: "held" }), new Set())).toBe("held");
  });

  test("treats seats under the user's own hold as selectable", () => {
    expect(
      resolveSeatState(seat({ state: "held", isMine: true }), new Set()),
    ).toBe("available");
  });

  test("marks contested seats as sold even when they were held by the user", () => {
    expect(
      resolveSeatState(seat({ state: "held", isMine: true }), new Set(["A1"])),
    ).toBe("sold");
  });
});
