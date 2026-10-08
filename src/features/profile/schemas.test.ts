import { describe, expect, test } from "bun:test";
import { getEligibilityMessage } from "./eligibility";
import { profileSchema } from "./schemas";

const valid = {
  fullName: "Jane Doe",
  mobileNumber: "555 123 456",
  dateOfBirth: "2000-05-12",
  preferredVenueId: "",
};

const firstMessage = (overrides: Partial<typeof valid>) => {
  const result = profileSchema.safeParse({ ...valid, ...overrides });
  return result.success ? null : result.error.issues[0].message;
};

describe("profileSchema", () => {
  test("accepts a valid profile", () => {
    expect(firstMessage({})).toBeNull();
  });

  test("uses the exact name messages", () => {
    expect(firstMessage({ fullName: "" })).toBe("Name is required");
    expect(firstMessage({ fullName: "Al" })).toBe(
      "Name must be at least 3 characters",
    );
    expect(firstMessage({ fullName: "x".repeat(51) })).toBe(
      "Name must not exceed 50 characters",
    );
  });

  test("uses the exact mobile number messages", () => {
    expect(firstMessage({ mobileNumber: "" })).toBe(
      "Mobile number is required",
    );
    expect(firstMessage({ mobileNumber: "455123456" })).toBe(
      "Georgian mobile numbers must start with 5",
    );
    expect(firstMessage({ mobileNumber: "5551234" })).toBe(
      "Mobile number must be exactly 9 digits",
    );
    expect(firstMessage({ mobileNumber: "55a123456" })).toBe(
      "Please enter a valid Georgian mobile number (9 digits starting with 5)",
    );
  });

  test("uses the exact date of birth messages", () => {
    expect(firstMessage({ dateOfBirth: "" })).toBe("Date of birth is required");
    expect(firstMessage({ dateOfBirth: "not-a-date" })).toBe(
      "Please enter a valid date of birth",
    );
    expect(firstMessage({ dateOfBirth: "2999-01-01" })).toBe(
      "Please enter a valid date of birth",
    );
    expect(
      firstMessage({ dateOfBirth: new Date().toISOString().slice(0, 10) }),
    ).toBe("You must be at least 12 years old to create an account");
  });
});

describe("getEligibilityMessage", () => {
  const ratings = [
    { code: "G", minAge: 0, description: "" },
    { code: "12+", minAge: 12, description: "" },
    { code: "16+", minAge: 16, description: "" },
    { code: "18+", minAge: 18, description: "" },
  ] as const;

  test("covers every rating for adults", () => {
    expect(getEligibilityMessage(24, [...ratings])).toBe(
      "You are 24, you can buy tickets for all age ratings",
    );
  });

  test("names the highest eligible rating for younger users", () => {
    expect(getEligibilityMessage(14, [...ratings])).toBe(
      "You are 14, you can buy tickets for ratings up to 12+",
    );
  });
});
