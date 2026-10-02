import { useId } from "react";
import { cn } from "@/lib/utils/cn";
import { Field, fieldErrorId } from "./field";
import { CheckIcon, ErrorIcon } from "./icons";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  valid?: boolean;
}

export function Input({
  label,
  error,
  valid,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const trailing = error ? (
    <ErrorIcon className="size-4 shrink-0 text-red" />
  ) : valid ? (
    <CheckIcon className="size-4 shrink-0 text-green" />
  ) : null;

  return (
    <Field
      id={inputId}
      label={label}
      error={error}
      trailing={trailing}
      className={className}
    >
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? fieldErrorId(inputId) : undefined}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-label-s text-fg outline-none",
          "placeholder:text-fg-secondary disabled:cursor-not-allowed",
        )}
        {...props}
      />
    </Field>
  );
}
