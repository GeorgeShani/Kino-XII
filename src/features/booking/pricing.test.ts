import { describe, expect, test } from "bun:test";
import type { TicketType } from "@/types/api";
import {
  getBookableTicketTypes,
  getSubtotal,
  sameSelection,
  summarizeTickets,
} from "./pricing";

const ticketTypes: TicketType[] = [
  {
    id: 1,
    slug: "adult",
    name: "Adult",
    priceRatio: 1,
    note: null,
    blockedFromRatingAge: null,
  },
  {
    id: 2,
    slug: "child",
    name: "Child",
    priceRatio: 0.6,
    note: null,
    blockedFromRatingAge: 16,
  },
  {
    id: 3,
    slug: "student",
    name: "Student",
    priceRatio: 0.75,
    note: null,
    blockedFromRatingAge: null,
  },
];

describe("getBookableTicketTypes", () => {
  test("hides child tickets for 16+ titles and sorts by price", () => {
    const slugs = getBookableTicketTypes(ticketTypes, 16).map(
      (type) => type.slug,
    );
    expect(slugs).toEqual(["student", "adult"]);
  });

  test("keeps every type for general audiences", () => {
    const slugs = getBookableTicketTypes(ticketTypes, 0).map(
      (type) => type.slug,
    );
    expect(slugs).toEqual(["child", "student", "adult"]);
  });
});

describe("getSubtotal", () => {
  test("applies each ticket type ratio and rounds to cents", () => {
    const selection = [
      { seatId: 1, code: "B3", ticketType: "adult" as const },
      { seatId: 2, code: "B4", ticketType: "student" as const },
      { seatId: 3, code: "B5", ticketType: "child" as const },
    ];
    expect(getSubtotal(selection, ticketTypes, 14.5)).toBe(14.5 + 10.88 + 8.7);
  });
});

describe("summarizeTickets", () => {
  test("groups by type, most common first", () => {
    const tickets = [
      { ticketType: { slug: "adult", name: "Adult" } },
      { ticketType: { slug: "child", name: "Child" } },
      { ticketType: { slug: "adult", name: "Adult" } },
    ];
    expect(summarizeTickets(tickets)).toBe("2 x Adult, 1 x Child");
  });
});

describe("sameSelection", () => {
  const held = [
    { seatId: 1, ticketType: { slug: "adult" } },
    { seatId: 2, ticketType: { slug: "student" } },
  ];

  test("matches regardless of order", () => {
    const selection = [
      { seatId: 2, code: "B4", ticketType: "student" as const },
      { seatId: 1, code: "B3", ticketType: "adult" as const },
    ];
    expect(sameSelection(selection, held)).toBe(true);
  });

  test("detects a changed ticket type", () => {
    const selection = [
      { seatId: 1, code: "B3", ticketType: "student" as const },
      { seatId: 2, code: "B4", ticketType: "student" as const },
    ];
    expect(sameSelection(selection, held)).toBe(false);
  });
});
