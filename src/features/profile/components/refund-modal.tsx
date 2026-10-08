"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { toApiError } from "@/lib/api/errors";
import { useSingleFlightMutate } from "@/lib/hooks/use-single-flight-mutate";
import { formatPrice } from "@/lib/utils/price";
import type { Order } from "@/types/api";
import { useRefundOrder } from "../hooks";

interface RefundModalProps {
  order: Order | null;
  onClose: () => void;
}

export function RefundModal({ order, onClose }: RefundModalProps) {
  const mutation = useRefundOrder();
  const mutate = useSingleFlightMutate(mutation);
  const { isPending, error, reset } = mutation;

  const close = () => {
    if (isPending) return;
    reset();
    onClose();
  };

  return (
    <Modal
      open={order !== null}
      onClose={close}
      title="Refund this order?"
      description={
        order
          ? `Order #${order.reference} for ${order.session.movie.title} will be refunded (${formatPrice(order.totalPrice)}) and your seats released. This can't be undone.`
          : undefined
      }
      showCloseButton={false}
      className="w-110"
    >
      {error && (
        <p role="alert" className="text-label-s text-red">
          {toApiError(error).message}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button
          data-autofocus
          variant="transparent"
          onClick={close}
          disabled={isPending}
        >
          Keep tickets
        </Button>
        <Button
          loading={isPending}
          onClick={() =>
            order &&
            mutate(order.reference, {
              onSuccess: () => {
                reset();
                onClose();
              },
            })
          }
        >
          Refund
        </Button>
      </div>
    </Modal>
  );
}
