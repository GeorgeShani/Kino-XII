import { useId, useRef } from "react";
import { Field, fieldErrorId } from "@/components/ui/field";
import { CalendarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

interface DateFieldProps
  extends Omit<React.ComponentProps<"input">, "type" | "ref"> {
  label: string;
  error?: string;
  inputRef: (element: HTMLInputElement | null) => void;
}

export function DateField({
  label,
  error,
  inputRef,
  className,
  id,
  ...props
}: DateFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const elementRef = useRef<HTMLInputElement | null>(null);

  return (
    <Field
      id={fieldId}
      label={label}
      error={error}
      className={className}
      trailing={
        <button
          type="button"
          aria-label="Open calendar"
          onClick={() => elementRef.current?.showPicker()}
          className="grid shrink-0 place-items-center"
        >
          <CalendarIcon className="size-4" />
        </button>
      }
    >
      <input
        id={fieldId}
        type="date"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? fieldErrorId(fieldId) : undefined}
        ref={(element) => {
          elementRef.current = element;
          inputRef(element);
        }}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-label-s outline-none [&::-webkit-calendar-picker-indicator]:hidden",
          error ? "text-red" : "text-fg",
        )}
        {...props}
      />
    </Field>
  );
}
