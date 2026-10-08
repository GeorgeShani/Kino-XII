import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center pb-34">
      <EmptyState
        title="Page not found"
        description="The page you are looking for does not exist or has moved."
        action={
          <Link href="/" className={buttonStyles({ variant: "transparent" })}>
            Back to home
          </Link>
        }
      />
    </main>
  );
}
