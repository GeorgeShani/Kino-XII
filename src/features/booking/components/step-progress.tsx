import { cn } from "@/lib/utils/cn";
import type { BookingStep } from "../flow-reducer";

interface StepProgressProps {
  step: BookingStep;
  canCheckout: boolean;
  onSeats: () => void;
  onCheckout: () => void;
}

const baseStyles =
  "flex flex-1 items-center justify-center rounded-full px-4 py-2.5 text-label-s transition-colors duration-300 ease-out";

export function StepProgress({
  step,
  canCheckout,
  onSeats,
  onCheckout,
}: StepProgressProps) {
  return (
    <div className="flex w-full gap-2 rounded-full bg-card">
      <button
        type="button"
        aria-current={step === "seats" ? "step" : undefined}
        onClick={onSeats}
        className={cn(baseStyles, step === "seats" && "bg-red text-white")}
      >
        SEATS
      </button>
      <button
        type="button"
        aria-current={step === "checkout" ? "step" : undefined}
        disabled={!canCheckout}
        onClick={onCheckout}
        className={cn(
          baseStyles,
          "disabled:cursor-not-allowed",
          step === "checkout" && "bg-red text-white",
        )}
      >
        CHECKOUT
      </button>
    </div>
  );
}
