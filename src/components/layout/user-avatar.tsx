import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { User } from "@/types/api";

type AvatarUser = Pick<
  User,
  "avatar" | "fullName" | "username" | "profileComplete"
>;

const SIZES = { md: "size-10", lg: "size-10.5" } as const;

function getInitials({ fullName, username }: AvatarUser) {
  const words = (fullName ?? "").split(/\s+/).filter(Boolean);
  const initials =
    words.length > 1
      ? words[0][0] + words[words.length - 1][0]
      : (words[0] ?? username).slice(0, 2);
  return initials.toUpperCase();
}

interface UserAvatarProps {
  user: AvatarUser;
  size?: keyof typeof SIZES;
}

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center rounded-lg bg-card text-label-s text-fg",
        SIZES[size],
      )}
    >
      {user.avatar ? (
        <Image
          src={user.avatar}
          alt=""
          width={42}
          height={42}
          unoptimized
          className="size-full rounded-lg object-cover"
        />
      ) : (
        getInitials(user)
      )}
      <span
        className={cn(
          "absolute right-0 bottom-0 size-2 rounded-full ring-1 ring-page",
          user.profileComplete ? "bg-green" : "bg-orange",
        )}
      />
    </span>
  );
}
