import { cn } from "@/lib/utils/cn";

const variants = {
  neutral: "bg-tint-white text-fg",
  red: "bg-tint-red text-red",
} as const;

const sizes = {
  md: "h-5.5 gap-1",
  sm: "h-4.75",
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
        "inline-flex shrink-0 items-center rounded-full px-2 text-label-s whitespace-nowrap [&_svg]:size-3.5",
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
