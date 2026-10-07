import { cn } from "@/lib/utils/cn";
import { formatDayOfMonth, formatWeekday } from "@/lib/utils/date";

interface DayPickerProps {
  days: string[];
  value: string;
  onChange: (isoDate: string) => void;
  size?: "md" | "sm";
  isDisabled?: (isoDate: string) => boolean;
  className?: string;
}

export function DayPicker({
  days,
  value,
  onChange,
  size = "md",
  isDisabled,
  className,
}: DayPickerProps) {
  const small = size === "sm";

  return (
    <div
      className={cn(
        small ? "grid grid-cols-7 gap-1.5" : "flex flex-wrap gap-1.75",
        className,
      )}
    >
      {days.map((day) => {
        const selected = day === value;

        return (
          <button
            key={day}
            type="button"
            aria-pressed={selected}
            disabled={isDisabled?.(day)}
            onClick={() => onChange(day)}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 transition-colors duration-300 ease-out",
              "disabled:cursor-not-allowed disabled:opacity-40",
              small
                ? "h-13.5 min-w-0 rounded-lg text-label-s shadow-chip"
                : "size-20 shrink-0 rounded-2xl",
              selected
                ? cn(
                    "bg-red text-white",
                    !small && "inset-ring-2 inset-ring-fg-disabled",
                  )
                : cn(
                    "text-fg",
                    small ? "bg-raised enabled:hover:bg-card" : "bg-card",
                  ),
            )}
          >
            <span className="text-label-s">{formatWeekday(day)}</span>
            <span className={small ? "text-label-s" : "text-h3"}>
              {formatDayOfMonth(day)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
