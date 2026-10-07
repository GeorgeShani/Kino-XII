import type { Metadata } from "next";
import { Suspense } from "react";
import { SessionsView } from "@/features/sessions/components/sessions-view";

export const metadata: Metadata = {
  title: "Sessions",
  description: "Browse showtimes across all Kino XII venues.",
};

export default function SessionsPage() {
  return (
    <main className="mx-auto flex w-full max-w-480 flex-1 flex-col gap-8.25 px-4 pt-1.75 pb-34 sm:px-8 xl:px-12.75">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-h1">Sessions</h1>
        <p className="text-body-m text-fg-secondary">
          Browse showtimes across all venues
        </p>
      </header>
      <Suspense>
        <SessionsView />
      </Suspense>
    </main>
  );
}
