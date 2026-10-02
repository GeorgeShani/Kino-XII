import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-10 text-center",
        className,
      )}
    >
      {icon && (
        <span className="grid size-12 place-items-center rounded-full bg-tint-white text-fg-secondary [&_svg]:size-5">
          {icon}
        </span>
      )}
      <h3 className="text-h3">{title}</h3>
      {description && (
        <p className="max-w-sm text-body-m text-fg-secondary">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
