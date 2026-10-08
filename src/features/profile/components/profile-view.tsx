"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import { useAuthStore } from "@/features/auth/store";
import { useTickets } from "../hooks";
import { ProfileForm } from "./profile-form";
import { TicketsView } from "./tickets-view";

const TABS = ["info", "tickets"] as const;

function ProfileStatus({ complete }: { complete: boolean }) {
  return complete ? (
    <p className="flex w-fit items-center gap-1.5 rounded-[10px] bg-tint-green px-3 py-2.5 text-label-m text-green">
      Profile Complete
      <CheckIcon />
    </p>
  ) : (
    <output className="block w-fit rounded-[10px] bg-tint-orange px-3 py-2.5 text-label-m text-orange">
      Please complete your profile to enable booking.
    </output>
  );
}

export function ProfileView() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const openModal = useAuthStore((state) => state.openModal);
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringLiteral(TABS).withDefault("info"),
  );
  const upcoming = useTickets("upcoming", status === "authenticated");

  if (status === "restoring") {
    return <Skeleton aria-hidden="true" className="h-96 max-w-220" />;
  }

  if (!user) {
    return (
      <EmptyState
        title="Log in to see your profile"
        description="Your personal details and tickets are available once you are signed in."
        action={<Button onClick={() => openModal("login")}>Log in</Button>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-9">
      <div className="border-b border-card">
        <Tabs
          variant="underline"
          label="Profile sections"
          value={tab}
          onChange={setTab}
          items={[
            { value: "info", label: "Personal Information" },
            {
              value: "tickets",
              label: "My Tickets",
              count: upcoming.data?.length || undefined,
            },
          ]}
        />
      </div>

      {tab === "info" ? (
        <div className="flex flex-col gap-6">
          <ProfileStatus complete={user.profileComplete} />
          <ProfileForm key={user.id} user={user} />
        </div>
      ) : (
        <TicketsView />
      )}
    </div>
  );
}
