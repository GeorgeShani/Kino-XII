import { isAxiosError } from "axios";

export type ApiErrorKind =
  | "network"
  | "unauthenticated"
  | "forbidden"
  | "not-found"
  | "conflict"
  | "validation"
  | "rule"
  | "server"
  | "unknown";

export type FieldErrors = Record<string, string>;

interface ErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
  contested?: string[];
}

const DEFAULT_MESSAGES: Record<ApiErrorKind, string> = {
  network: "Can't reach the server. Check your connection and try again.",
  unauthenticated: "Please log in to continue.",
  forbidden: "You don't have access to this.",
  "not-found": "We couldn't find what you were looking for.",
  conflict: "Someone else got there first.",
  validation: "Please check the highlighted fields.",
  rule: "This action isn't allowed right now.",
  server: "Something went wrong on our side. Please try again.",
  unknown: "Something went wrong. Please try again.",
};

export class ApiError extends Error {
  constructor(
    readonly kind: ApiErrorKind,
    message: string,
    readonly status: number | null = null,
    readonly fieldErrors: FieldErrors = {},
    readonly contested: string[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isApiError(
  error: unknown,
  kind?: ApiErrorKind,
): error is ApiError {
  return (
    error instanceof ApiError && (kind === undefined || error.kind === kind)
  );
}

function toFieldErrors(errors: ErrorBody["errors"]): FieldErrors {
  const result: FieldErrors = {};
  for (const [field, messages] of Object.entries(errors ?? {})) {
    if (messages[0]) result[field] = messages[0];
  }
  return result;
}

function kindForStatus(status: number, body?: ErrorBody): ApiErrorKind {
  if (status === 401) return "unauthenticated";
  if (status === 403) return "forbidden";
  if (status === 404) return "not-found";
  if (status === 409) return "conflict";
  if (status === 422) {
    return Object.keys(body?.errors ?? {}).length > 0 ? "validation" : "rule";
  }
  if (status >= 500) return "server";
  return "unknown";
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (!isAxiosError<ErrorBody>(error)) {
    return new ApiError("unknown", DEFAULT_MESSAGES.unknown);
  }

  if (!error.response) {
    return new ApiError("network", DEFAULT_MESSAGES.network);
  }

  const { status, data } = error.response;
  const kind = kindForStatus(status, data);
  const message =
    kind === "server"
      ? DEFAULT_MESSAGES.server
      : (data?.message ?? DEFAULT_MESSAGES[kind]);

  return new ApiError(
    kind,
    message,
    status,
    toFieldErrors(data?.errors),
    data?.contested ?? [],
  );
}
