import { cn } from "@/lib/utils/cn";
import { ChevronDownIcon } from "./icons";

type PageItem = number | "ellipsis";

const FULL_LIST_LIMIT = 7;

function getPageItems(page: number, pageCount: number): PageItem[] {
  if (pageCount <= FULL_LIST_LIMIT) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = [...new Set([1, pageCount, page - 1, page, page + 1])]
    .filter((candidate) => candidate >= 1 && candidate <= pageCount)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  pages.forEach((current, index) => {
    const previous = pages[index - 1];
    if (previous !== undefined) {
      if (current - previous === 2) items.push(previous + 1);
      else if (current - previous > 2) items.push("ellipsis");
    }
    items.push(current);
  });
  return items;
}

const buttonBase =
  "grid size-10 place-items-center rounded-full text-body-m font-medium transition-colors duration-300 ease-out";

const arrowButton = cn(
  buttonBase,
  "bg-card text-fg-secondary enabled:hover:bg-raised disabled:cursor-not-allowed disabled:opacity-40",
);

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-2", className)}
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={arrowButton}
      >
        <ChevronDownIcon className="rotate-90" />
      </button>

      {getPageItems(page, pageCount).map((item, index) =>
        item === "ellipsis" ? (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis has no stable identity
            key={`ellipsis-${index}`}
            className={cn(buttonBase, "text-fg-secondary")}
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              buttonBase,
              item === page
                ? "bg-red text-white"
                : "text-fg-secondary hover:bg-raised",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className={arrowButton}
      >
        <ChevronDownIcon className="-rotate-90" />
      </button>
    </nav>
  );
}
