import { describe, expect, test } from "bun:test";
import { checkoutSchema } from "./schemas";

const valid = {
  fullName: "Jane Doe",
  email: "jane@kinoxii.test",
  mobileNumber: "555 123 456",
  cardNumber: "4242 4242 4242 4242",
  expiry: "12/99",
  cvv: "123",
};

describe("checkoutSchema", () => {
  test("accepts a complete, valid form", () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
  });

  test("rejects mobile numbers that do not start with 5", () => {
    expect(
      checkoutSchema.safeParse({ ...valid, mobileNumber: "455 123 456" })
        .success,
    ).toBe(false);
  });

  test("rejects expired cards", () => {
    expect(
      checkoutSchema.safeParse({ ...valid, expiry: "01/20" }).success,
    ).toBe(false);
  });

  test("rejects short card numbers and cvv", () => {
    expect(
      checkoutSchema.safeParse({ ...valid, cardNumber: "4242 4242" }).success,
    ).toBe(false);
    expect(checkoutSchema.safeParse({ ...valid, cvv: "12" }).success).toBe(
      false,
    );
  });
});
