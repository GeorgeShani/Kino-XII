import { useId } from "react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FilterSection({ title, children }: FilterSectionProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <h3 id={headingId} className="text-overline text-fg-secondary uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}
