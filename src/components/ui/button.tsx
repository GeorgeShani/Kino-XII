import { cn } from "@/lib/utils/cn";
import { Spinner } from "./spinner";

const variants = {
  primary: "bg-red text-white enabled:hover:brightness-110",
  secondary: "bg-fg text-page enabled:hover:opacity-90",
  transparent:
    "bg-tint-white text-fg enabled:hover:bg-fg-secondary enabled:hover:text-white",
  outline: "border border-fg-secondary text-fg enabled:hover:bg-tint-white",
} as const;

const sizes = {
  md: "h-10.5 px-5.5 text-button",
  sm: "h-8.75 px-5.5 text-button",
  xs: "h-7 px-3 text-label-s",
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
    "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-fg-disabled disabled:text-fg-secondary",
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
