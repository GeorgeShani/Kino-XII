import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/price";

interface PanelFooterProps {
  total: number;
  label: string;
  disabled: boolean;
  loading?: boolean;
  type?: "button" | "submit";
  form?: string;
  onClick?: () => void;
}

export function PanelFooter({
  total,
  label,
  disabled,
  loading,
  type = "button",
  form,
  onClick,
}: PanelFooterProps) {
  return (
    <div className="flex flex-col gap-3 pt-2.5">
      <div className="flex items-center justify-between px-1.25">
        <span className="text-label-s">SUBTOTAL</span>
        <span className="text-h1">{formatPrice(total)}</span>
      </div>
      <Button
        type={type}
        form={form}
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        className="w-full"
      >
        {label}
      </Button>
    </div>
  );
}
