import { ChevronDownIcon } from "@/components/ui/icons";
import type { SessionSort, SortOption } from "@/types/api";

interface SessionsToolbarProps {
  totalSessions: number | undefined;
  sorts: SortOption[];
  sort: SessionSort;
  onSortChange: (sort: SessionSort) => void;
}

export function SessionsToolbar({
  totalSessions,
  sorts,
  sort,
  onSortChange,
}: SessionsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="min-h-4.5 text-label-m">
        {totalSessions !== undefined &&
          `Showing ${totalSessions} ${totalSessions === 1 ? "session" : "sessions"}`}
      </p>

      <label className="flex items-center gap-2 text-body-m text-fg-secondary">
        Sort:
        <span className="relative flex items-center">
          <select
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value as SessionSort)
            }
            className="cursor-pointer appearance-none bg-transparent pr-6 text-button text-fg outline-none focus-visible:underline"
          >
            {sorts.map((option) => (
              <option key={option.id} value={option.id} className="bg-card">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-0 size-4" />
        </span>
      </label>
    </div>
  );
}
