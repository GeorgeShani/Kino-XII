import { cn } from "@/lib/utils/cn";

interface FieldProps {
  id: string;
  label?: string;
  error?: string;
  trailing?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const fieldErrorId = (id: string) => `${id}-error`;

export function Field({
  id,
  label,
  error,
  trailing,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-2.5">
        {label && (
          <label
            htmlFor={id}
            className={cn("text-label-s", error ? "text-red" : "text-fg")}
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex h-10 items-center gap-1.5 rounded-xl border border-transparent bg-card px-4 transition-colors duration-300 ease-out",
            "hover:not-focus-within:border-fg-disabled hover:not-focus-within:bg-raised focus-within:border-fg-disabled",
            "has-disabled:cursor-not-allowed has-disabled:opacity-60",
            error &&
              "border-red hover:not-focus-within:border-red focus-within:border-red",
          )}
        >
          {children}
          {trailing}
        </div>
      </div>
      {error && (
        <p id={fieldErrorId(id)} className="text-label-s text-red">
          {error}
        </p>
      )}
    </div>
  );
}
