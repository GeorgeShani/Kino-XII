"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils/cn";

interface TabItem<T extends string> {
  value: T;
  label: string;
  count?: number;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: "pill" | "underline";
  label: string;
  className?: string;
}

const ARROW_STEPS: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  variant = "pill",
  label,
  className,
}: TabsProps<T>) {
  const tabRefs = useRef(new Map<T, HTMLButtonElement>());
  const isPill = variant === "pill";

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const step = ARROW_STEPS[event.key];
    if (!step) return;

    event.preventDefault();
    const next = items[(index + step + items.length) % items.length];
    onChange(next.value);
    tabRefs.current.get(next.value)?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        isPill ? "inline-flex rounded-xl bg-card p-1.25" : "flex gap-8",
        className,
      )}
    >
      {items.map((item, index) => {
        const active = item.value === value;

        return (
          <button
            key={item.value}
            ref={(node) => {
              if (node) tabRefs.current.set(item.value, node);
              else tabRefs.current.delete(item.value);
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "text-label-m transition-colors duration-300 ease-out",
              isPill
                ? "flex items-center gap-2 rounded-[10px] px-3.5 py-1.75"
                : "flex flex-col gap-3.5",
              active ? "text-fg" : "text-fg-secondary",
              isPill && active && "bg-raised",
            )}
          >
            <span className="flex items-center gap-2">
              {item.label}
              {item.count !== undefined &&
                (isPill ? (
                  <span
                    className={cn(
                      "text-label-s",
                      active ? "text-fg" : "text-fg-disabled",
                    )}
                  >
                    {item.count}
                  </span>
                ) : (
                  <span className="rounded-full bg-red px-1.5 py-0.5 text-label-s text-white">
                    {item.count}
                  </span>
                ))}
            </span>
            {!isPill && (
              <span
                className={cn(
                  "h-0.5 w-full rounded-t-sm transition-colors duration-300 ease-out",
                  active ? "bg-red" : "bg-transparent",
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
