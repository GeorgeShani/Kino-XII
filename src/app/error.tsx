"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex flex-1 items-center justify-center pb-34">
      <EmptyState
        title="Something went wrong"
        description="An unexpected error occurred. Please try again."
        action={
          <Button variant="transparent" onClick={reset}>
            Try again
          </Button>
        }
      />
    </main>
  );
}
