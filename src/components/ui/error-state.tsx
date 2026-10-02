import { toApiError } from "@/lib/api/errors";
import { Button } from "./button";
import { EmptyState } from "./empty-state";
import { ErrorIcon } from "./icons";

interface ErrorStateProps {
  error?: unknown;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  error,
  title = "Something went wrong",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={<ErrorIcon />}
      title={title}
      description={toApiError(error).message}
      className={className}
      action={
        onRetry && (
          <Button variant="transparent" onClick={onRetry}>
            Try again
          </Button>
        )
      }
    />
  );
}
