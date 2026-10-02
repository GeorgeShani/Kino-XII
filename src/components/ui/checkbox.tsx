import { cn } from "@/lib/utils/cn";
import { CheckIcon } from "./icons";

interface CheckboxProps
  extends Omit<React.ComponentProps<"input">, "type" | "children"> {
  label: React.ReactNode;
  hint?: React.ReactNode;
}

export function Checkbox({ label, hint, className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 has-disabled:cursor-not-allowed has-disabled:opacity-60",
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        className={cn(
          "grid size-4.5 shrink-0 place-items-center rounded-[5px] border-[1.5px] border-fg-disabled text-white transition-colors duration-300 ease-out",
          "peer-checked:border-red peer-checked:bg-red peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-red",
          "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
        )}
      >
        <CheckIcon className="size-3" />
      </span>
      <span className="flex items-baseline gap-1.25 text-label-m text-fg">
        {label}
        {hint && <span className="text-body-s text-fg-secondary">{hint}</span>}
      </span>
    </label>
  );
}
