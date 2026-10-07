"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  LogOutIcon,
  TicketIcon,
  UserIcon,
} from "@/components/ui/icons";
import { useLogout } from "@/features/auth/mutations";
import { cn } from "@/lib/utils/cn";
import type { User } from "@/types/api";
import { UserAvatar } from "./user-avatar";

const itemStyles =
  "flex w-full items-center gap-2 rounded-[10px] py-2.5 pl-5 text-label-m transition-colors duration-300 ease-out hover:bg-card focus-visible:bg-card";

function ProfileStatus({ complete }: { complete: boolean }) {
  if (complete) {
    return (
      <div className="mx-5 flex items-center gap-1.5 rounded-[10px] bg-tint-green px-3 py-2.5 text-label-m text-green">
        Profile Complete
        <CheckIcon />
      </div>
    );
  }

  return (
    <div className="mx-5 flex flex-col gap-0.5 rounded-[10px] bg-orange/10 px-3 py-2.5">
      <p className="text-label-m text-orange">Profile incomplete</p>
      <p className="text-body-s text-fg-secondary">
        Please complete your profile to enable booking
      </p>
    </div>
  );
}

export function ProfileMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { mutate: logout } = useLogout();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const displayName = user.fullName ?? user.username;
  const firstName = displayName.split(" ")[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-6"
      >
        <span className="flex items-center gap-3">
          <UserAvatar user={user} />
          <span className="text-label-m">{firstName}</span>
        </span>
        <ChevronDownIcon
          className={cn(
            "transition-transform duration-300 ease-out",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-[calc(100%+5px)] right-0 z-40 w-75.5 max-w-[calc(100vw-2rem)] rounded-2xl bg-page pb-2.5 text-fg shadow-popover"
        >
          <div className="flex flex-col gap-4 pt-5">
            <div className="flex items-center gap-2.5 px-5">
              <UserAvatar user={user} size="lg" />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-label-m">{displayName}</p>
                <p className="truncate text-body-s text-fg-secondary">
                  {user.email}
                </p>
              </div>
            </div>
            <ProfileStatus complete={user.profileComplete} />
          </div>

          <div className="mt-1 flex flex-col gap-1">
            <div className="flex flex-col gap-0.5 pt-1">
              <Link
                href="/profile"
                role="menuitem"
                onClick={() => setOpen(false)}
                className={cn(itemStyles, "min-h-10")}
              >
                <UserIcon />
                My Profile
              </Link>
              <Link
                href="/profile?tab=tickets"
                role="menuitem"
                onClick={() => setOpen(false)}
                className={cn(itemStyles, "min-h-10")}
              >
                <TicketIcon />
                My Tickets
              </Link>
            </div>
            <hr className="h-px border-0 bg-tint-white" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className={cn(itemStyles, "min-h-9 text-red")}
            >
              <LogOutIcon />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
