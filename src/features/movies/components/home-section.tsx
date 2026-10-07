interface HomeSectionProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function HomeSection({ title, action, children }: HomeSectionProps) {
  return (
    <section className="flex flex-col gap-6 px-4 sm:px-8 xl:px-17.5">
      <div className="flex items-end justify-between gap-6">
        <h2 className="text-h1">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export const sectionActionStyles =
  "text-label-m text-red transition-opacity duration-300 ease-out hover:opacity-80";

export function SectionDivider() {
  return <hr className="h-px border-0 bg-tint-white" />;
}
