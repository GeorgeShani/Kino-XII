import { describe, expect, test } from "bun:test";
import {
  formatCardNumber,
  formatExpiry,
  formatMobileNumber,
  normalizeMobileNumber,
} from "./masks";

describe("masks", () => {
  test("groups card numbers in fours and caps at 16 digits", () => {
    expect(formatCardNumber("42424242424242429999")).toBe(
      "4242 4242 4242 4242",
    );
  });

  test("inserts the expiry slash after the month", () => {
    expect(formatExpiry("1")).toBe("1");
    expect(formatExpiry("123")).toBe("12/3");
    expect(formatExpiry("1230")).toBe("12/30");
  });

  test("groups mobile numbers in threes", () => {
    expect(formatMobileNumber("555123456")).toBe("555 123 456");
  });

  test("strips the country code from stored mobile numbers", () => {
    expect(normalizeMobileNumber("+995555123456")).toBe("555123456");
    expect(normalizeMobileNumber(null)).toBe("");
  });
});
