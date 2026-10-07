import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DayPicker } from "@/components/ui/day-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { getNextDays } from "@/lib/utils/date";
import type { FilterOptions, TimeBand } from "@/types/api";
import { DAYS_AHEAD } from "../constants";
import { countActiveFilters, type SessionFilters } from "../filters";
import { getAvailableFormats } from "../narrowing";
import { FilterSection } from "./filter-section";

const BAND_LABEL = /^(.*?)\s*\((.*)\)$/;

function splitBandLabel(label: string) {
  const match = BAND_LABEL.exec(label);
  return match
    ? { name: match[1], hint: match[2].replace(" - ", "–") }
    : { name: label, hint: undefined };
}

const toggle = <T extends string>(list: T[], value: T) =>
  list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];

function Divider() {
  return <hr className="h-px border-0 bg-raised" />;
}

interface FilterSidebarProps {
  options: FilterOptions | undefined;
  filters: SessionFilters;
  date: string;
  onVenuesChange: (venues: string[]) => void;
  onFormatsChange: (formats: string[]) => void;
  onLanguagesChange: (languages: string[]) => void;
  onBandsChange: (bands: TimeBand[]) => void;
  onDateChange: (date: string) => void;
  onClear: () => void;
}

export function FilterSidebar({
  options,
  filters,
  date,
  onVenuesChange,
  onFormatsChange,
  onLanguagesChange,
  onBandsChange,
  onDateChange,
  onClear,
}: FilterSidebarProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <aside
      aria-label="Filters"
      className="flex flex-col gap-6 rounded-2xl bg-card p-6"
    >
      <h2 className="text-h3">Filters</h2>

      {options ? (
        <>
          <FilterSection title="Venue">
            <div className="flex flex-col gap-3">
              {options.venues.map((venue) => (
                <Checkbox
                  key={venue.slug}
                  label={venue.name}
                  hint={`· ${venue.city}`}
                  checked={filters.venues.includes(venue.slug)}
                  onChange={() =>
                    onVenuesChange(toggle(filters.venues, venue.slug))
                  }
                />
              ))}
            </div>
          </FilterSection>

          <Divider />

          <FilterSection title="Date">
            <DayPicker
              size="sm"
              days={getNextDays(DAYS_AHEAD)}
              value={date}
              onChange={onDateChange}
            />
          </FilterSection>

          <Divider />

          <FilterSection title="Format">
            <div className="flex flex-col gap-3">
              {getAvailableFormats(
                options.formats,
                options.venues,
                filters.venues,
              ).map((format) => (
                <Checkbox
                  key={format.slug}
                  label={format.name}
                  checked={filters.formats.includes(format.slug)}
                  onChange={() =>
                    onFormatsChange(toggle(filters.formats, format.slug))
                  }
                />
              ))}
            </div>
          </FilterSection>

          <Divider />

          <FilterSection title="Language">
            <div className="flex flex-col gap-3">
              {options.languages.map((language) => (
                <Checkbox
                  key={language.slug}
                  label={language.name}
                  checked={filters.languages.includes(language.slug)}
                  onChange={() =>
                    onLanguagesChange(toggle(filters.languages, language.slug))
                  }
                />
              ))}
            </div>
          </FilterSection>

          <Divider />

          <FilterSection title="Time of day">
            <div className="flex flex-col gap-3">
              {options.timeBands.map((band) => {
                const { name, hint } = splitBandLabel(band.label);
                return (
                  <Checkbox
                    key={band.id}
                    label={name}
                    hint={hint}
                    checked={filters.bands.includes(band.id)}
                    onChange={() =>
                      onBandsChange(toggle(filters.bands, band.id))
                    }
                  />
                );
              })}
            </div>
          </FilterSection>
        </>
      ) : (
        <div aria-hidden="true" className="flex flex-col gap-3">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton
              // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
              key={index}
              className="h-4.5 w-full"
            />
          ))}
        </div>
      )}

      <Divider />

      <div className="flex flex-col items-center gap-3">
        {activeCount > 0 && (
          <Button
            variant="outline"
            size="xs"
            className="w-full py-2.25"
            onClick={onClear}
          >
            Clear filters
          </Button>
        )}
        <p className="text-body-s text-fg-secondary">
          {activeCount} {activeCount === 1 ? "filter" : "filters"} active
        </p>
      </div>
    </aside>
  );
}
