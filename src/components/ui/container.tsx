import { cn } from "@/lib/utils/cn";

export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-480 px-4 sm:px-8 xl:px-12.75",
        className,
      )}
      {...props}
    />
  );
}
