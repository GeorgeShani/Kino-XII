import { z } from "zod";

const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .pipe(z.email("Enter a valid email address"));

const password = z
  .string()
  .min(1, "Password is required")
  .pipe(z.string().min(3, "At least 3 characters"));

const avatar = z
  .custom<File>((value) => value instanceof File)
  .refine(
    (file) => AVATAR_TYPES.includes(file.type),
    "Use a JPG, PNG or WEBP image",
  )
  .refine(
    (file) => file.size <= AVATAR_MAX_BYTES,
    "Image must be 2MB or smaller",
  )
  .optional();

export const loginSchema = z.object({ email, password });

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, "Username is required")
      .pipe(z.string().min(3, "At least 3 characters")),
    email,
    password,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    avatar,
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
