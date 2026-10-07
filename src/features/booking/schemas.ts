import { z } from "zod";
import { digitsOnly } from "@/lib/forms/masks";

const isFutureExpiry = (value: string) => {
  const [month, year] = value.split("/").map(Number);
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  return (
    year > currentYear || (year === currentYear && month >= now.getMonth() + 1)
  );
};

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .pipe(
      z
        .string()
        .min(3, "At least 3 characters")
        .max(50, "At most 50 characters"),
    ),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .refine(
      (value) => /^5\d{8}$/.test(digitsOnly(value)),
      "Enter a 9 digit number starting with 5",
    ),
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .refine((value) => digitsOnly(value).length === 16, "Enter 16 digits"),
  expiry: z
    .string()
    .min(1, "Expiry is required")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use the MM/YY format")
    .refine(isFutureExpiry, "This card has expired"),
  cvv: z
    .string()
    .min(1, "CVV is required")
    .regex(/^\d{3}$/, "Enter 3 digits"),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
