import { cn } from "@/lib/utils/cn";
import { Spinner } from "./spinner";

const variants = {
  primary:
    "bg-red text-white enabled:hover:shadow-[0_0_26px_#ec30131f] enabled:hover:inset-ring-1 enabled:hover:inset-ring-[#ea5038]",
  secondary: "bg-fg text-page",
  transparent:
    "bg-tint-white text-fg enabled:hover:bg-fg-secondary enabled:hover:text-white enabled:hover:backdrop-blur-[22px]",
  outline:
    "inset-ring-1 inset-ring-fg-secondary text-fg enabled:hover:bg-tint-white",
} as const;

const sizes = {
  md: "px-5.5 py-3.25 text-button [&_svg]:size-4",
  sm: "px-5.5 py-2.5 text-button [&_svg]:size-4",
  xs: "px-3 py-1.5 text-label-s [&_svg]:size-4",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-1 rounded-full whitespace-nowrap transition duration-300 ease-out",
    "disabled:cursor-not-allowed disabled:inset-ring-0 disabled:bg-fg-disabled disabled:text-fg-secondary",
    variants[variant],
    sizes[size],
    className,
  );
}

interface ButtonProps
  extends React.ComponentProps<"button">,
    Omit<ButtonStyleOptions, "className"> {
  loading?: boolean;
}

export function Button({
  variant,
  size,
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
