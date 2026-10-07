import { cn } from "@/lib/utils/cn";

const variants = {
  neutral: "bg-tint-white text-fg",
  red: "bg-tint-red text-red",
  orange: "bg-tint-orange text-orange",
} as const;

const sizes = {
  sm: "px-2 py-[3px]",
  md: "gap-1 px-2 py-1",
  lg: "gap-1 px-3 py-1.5",
} as const;

interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  icon?: React.ReactNode;
}

export function Badge({
  variant = "neutral",
  size = "md",
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full text-label-s whitespace-nowrap [&_svg]:size-3.5",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
