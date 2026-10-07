import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toApiError } from "@/lib/api/errors";

export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fieldMap: Record<string, Path<T>> = {},
): string | null {
  const apiError = toApiError(error);
  const entries = Object.entries(apiError.fieldErrors);

  if (apiError.kind !== "validation" || entries.length === 0) {
    return apiError.message;
  }

  for (const [field, message] of entries) {
    setError(fieldMap[field] ?? (field as Path<T>), {
      type: "server",
      message,
    });
  }
  return null;
}
