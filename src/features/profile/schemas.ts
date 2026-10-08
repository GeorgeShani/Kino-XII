import { differenceInYears, isValid, parseISO } from "date-fns";
import { z } from "zod";
import { digitsOnly } from "@/lib/forms/masks";

const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
const MIN_AGE_YEARS = 12;

const INVALID_MOBILE =
  "Please enter a valid Georgian mobile number (9 digits starting with 5)";

const mobileNumber = z.string().superRefine((value, context) => {
  const compact = value.replace(/\s/g, "");
  const fail = (message: string) =>
    context.addIssue({ code: "custom", message });

  if (!compact) return fail("Mobile number is required");
  if (/\D/.test(compact)) return fail(INVALID_MOBILE);
  if (!compact.startsWith("5")) {
    return fail("Georgian mobile numbers must start with 5");
  }
  if (digitsOnly(compact).length !== 9) {
    return fail("Mobile number must be exactly 9 digits");
  }
});

const dateOfBirth = z.string().superRefine((value, context) => {
  const fail = (message: string) =>
    context.addIssue({ code: "custom", message });

  if (!value) return fail("Date of birth is required");

  const date = parseISO(value);
  if (!isValid(date) || date > new Date() || date.getFullYear() < 1900) {
    return fail("Please enter a valid date of birth");
  }
  if (differenceInYears(new Date(), date) < MIN_AGE_YEARS) {
    return fail("You must be at least 12 years old to create an account");
  }
});

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .pipe(
      z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must not exceed 50 characters"),
    ),
  mobileNumber,
  dateOfBirth,
  preferredVenueId: z.string(),
  avatar: z
    .custom<File>((value) => value instanceof File)
    .refine(
      (file) => AVATAR_TYPES.includes(file.type),
      "Use a JPG, PNG or WEBP image",
    )
    .refine(
      (file) => file.size <= AVATAR_MAX_BYTES,
      "Image must be 2MB or smaller",
    )
    .optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;
