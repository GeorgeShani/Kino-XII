import { useId } from "react";
import { Field, fieldErrorId } from "./field";
import { ChevronDownIcon } from "./icons";

interface SelectProps extends React.ComponentProps<"select"> {
  label?: string;
  error?: string;
}

export function Select({
  label,
  error,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <Field
      id={selectId}
      label={label}
      error={error}
      className={className}
      trailing={
        <ChevronDownIcon className="pointer-events-none -ml-5.5 size-4 shrink-0 text-fg" />
      }
    >
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? fieldErrorId(selectId) : undefined}
        className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pr-6 text-label-s text-fg outline-none has-[option[value='']:checked]:text-fg-secondary"
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}
