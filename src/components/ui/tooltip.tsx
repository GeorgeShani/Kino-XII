import { useId } from "react";
import { cn } from "@/lib/utils/cn";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const id = useId();

  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      <span aria-describedby={id} className="inline-flex">
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-64 -translate-x-1/2 rounded-lg bg-raised px-3 py-2 text-body-s text-fg shadow-modal",
          "opacity-0 transition-opacity duration-200 group-focus-within/tooltip:opacity-100 group-hover/tooltip:opacity-100",
        )}
      >
        {content}
      </span>
    </span>
  );
}
