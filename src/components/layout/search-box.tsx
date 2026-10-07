"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { CloseIcon, MagnifierIcon } from "@/components/ui/icons";
import { SearchPanel } from "@/features/search/components/search-panel";
import { useMovieSearch } from "@/features/search/hooks";
import { cn } from "@/lib/utils/cn";

const RESULT_SELECTOR = "[data-search-result]";

export function SearchBox({ className }: { className?: string }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [rawQuery, setRawQuery] = useState("");
  const [open, setOpen] = useState(false);
  const search = useMovieSearch(rawQuery);

  const getResults = () =>
    Array.from(
      rootRef.current?.querySelectorAll<HTMLElement>(RESULT_SELECTOR) ?? [],
    );

  const close = () => {
    setOpen(false);
    setRawQuery("");
    if (rootRef.current?.contains(document.activeElement)) {
      (document.activeElement as HTMLElement).blur();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    const results = getResults();
    if (results.length === 0) return;
    event.preventDefault();

    const current = results.indexOf(document.activeElement as HTMLElement);
    if (event.key === "ArrowDown") {
      results[Math.min(current + 1, results.length - 1)].focus();
    } else if (current <= 0) {
      inputRef.current?.focus();
    } else {
      results[current - 1].focus();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const first = search.data?.[0];
    if (!first || search.isSettling) return;
    router.push(`/movies/${first.slug}`);
    close();
  };

  return (
    <search
      ref={rootRef}
      className={cn("relative flex w-full justify-end lg:w-120", className)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={handleKeyDown}
    >
      <form
        onSubmit={handleSubmit}
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
          value={rawQuery}
          onChange={(event) => setRawQuery(event.target.value)}
          autoComplete="off"
          aria-label="Search films and live events"
          placeholder="Search films and live events"
          className="min-w-0 flex-1 bg-transparent text-body-m outline-none placeholder:text-current focus:placeholder:text-fg-disabled"
        />
        {rawQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setRawQuery("");
              inputRef.current?.focus();
            }}
            className="grid size-6 shrink-0 place-items-center rounded-full bg-current/10"
          >
            <CloseIcon className="size-5" />
          </button>
        )}
      </form>

      {open && (
        <SearchPanel
          query={search.query}
          results={search.data}
          isPending={search.isPending && search.debouncedQuery.length > 0}
          isSettling={search.isSettling}
          error={search.error}
          onRetry={() => search.refetch()}
          onNavigate={close}
        />
      )}
    </search>
  );
}
