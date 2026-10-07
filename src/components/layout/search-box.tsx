"use client";

import { useRef, useState } from "react";
import { CloseIcon, MagnifierIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

export function SearchBox({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("flex w-full justify-end lg:w-120", className)}>
      <div
        className={cn(
          "flex h-10.25 w-full items-center gap-1 rounded-full bg-current/10 pr-3 pl-3 lg:w-95",
          "transition-[width,box-shadow] duration-300 ease-out",
          "hover:inset-ring-1 hover:inset-ring-current/10 focus-within:inset-ring-1 focus-within:inset-ring-current/10 focus-within:backdrop-blur-sm lg:focus-within:w-120",
          "has-[input:not(:placeholder-shown)]:gap-2 has-[input:not(:placeholder-shown)]:pr-2",
        )}
      >
        <MagnifierIcon className="shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          aria-label="Search films and live events"
          placeholder="Search films and live events"
          className="min-w-0 flex-1 bg-transparent text-body-m outline-none placeholder:text-current focus:placeholder:text-fg-disabled"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="grid size-6 shrink-0 place-items-center rounded-full bg-current/10"
          >
            <CloseIcon className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}
