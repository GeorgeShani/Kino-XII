import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfileView } from "@/features/profile/components/profile-view";

export const metadata: Metadata = { title: "My Profile" };

export default function ProfilePage() {
  return (
    <main className="mx-auto flex w-full max-w-480 flex-1 flex-col gap-7 px-4 pt-1.75 pb-34 sm:px-8 xl:px-12.75">
      <h1 className="text-h1">My Profile</h1>
      <Suspense>
        <ProfileView />
      </Suspense>
    </main>
  );
}
