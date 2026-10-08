"use client";

import { Button } from "@/components/ui/button";
import { BellIcon, CheckIcon } from "@/components/ui/icons";
import { requireAuth } from "@/features/auth/gate";
import { useSingleFlightMutate } from "@/lib/hooks/use-single-flight-mutate";
import { useNotifyMovie } from "../hooks";

interface NotifyButtonProps {
  slug: string;
  notified: boolean;
}

export function NotifyButton({ slug, notified }: NotifyButtonProps) {
  const mutation = useNotifyMovie();
  const mutate = useSingleFlightMutate(mutation);
  const { isPending, isError } = mutation;

  if (notified) {
    return (
      <output className="inline-flex items-center gap-1 self-start rounded-full bg-tint-white px-3 py-1.5 text-label-s text-fg inset-ring-1 inset-ring-fg-secondary">
        <CheckIcon className="size-4" />
        Reminder set
      </output>
    );
  }

  return (
    <Button
      variant="outline"
      size="xs"
      loading={isPending}
      onClick={() => requireAuth(() => mutate(slug))}
      className="self-start"
    >
      <BellIcon />
      {isError ? "Try again" : "Notify Me"}
    </Button>
  );
}
