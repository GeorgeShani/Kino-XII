import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  size?: "lg" | "sm";
  className?: string;
}

export function Logo({ size = "lg", className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Kino XII home"
      className={cn(
        "flex items-center",
        size === "lg" ? "gap-1.5 text-h2" : "gap-1 text-button",
        className,
      )}
    >
      <span>KINO</span>
      <span className="text-red">XII</span>
    </Link>
  );
}
