"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store";
import { cn } from "@/lib/utils/cn";
import { Logo } from "./logo";
import { ProfileMenu } from "./profile-menu";
import { SearchBox } from "./search-box";

function AuthActions({ overHero }: { overHero: boolean }) {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const openModal = useAuthStore((state) => state.openModal);

  if (status === "restoring") {
    return <div aria-hidden="true" className="h-10 w-48" />;
  }

  if (user) return <ProfileMenu user={user} />;

  return (
    <div className="flex items-center gap-3">
      <Button onClick={() => openModal("register")}>Sign up</Button>
      <Button
        variant="secondary"
        className={overHero ? "bg-white text-ink" : undefined}
        onClick={() => openModal("login")}
      >
        Log in
      </Button>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const overHero = pathname === "/" || pathname.startsWith("/movies/");

  return (
    <header
      className={cn(
        "z-30 bg-linear-to-b pt-7.5 pb-10",
        overHero
          ? "absolute inset-x-0 top-0 from-black via-black/51 via-80% to-black/0 text-white"
          : "relative from-page via-page/51 via-80% to-page/0 text-fg dark:from-black dark:via-black/51 dark:to-black/0",
      )}
    >
      <div className="mx-auto flex w-full max-w-480 flex-wrap items-center gap-x-8 gap-y-4 px-4 sm:px-8 xl:px-15">
        <div className="order-1 mr-auto flex items-center gap-4 sm:gap-9">
          <Logo />
          <Link href="/sessions" className="text-overline uppercase">
            Sessions
          </Link>
        </div>
        <SearchBox className="order-3 lg:order-2" />
        <div className="order-2 lg:order-3">
          <AuthActions overHero={overHero} />
        </div>
      </div>
    </header>
  );
}
