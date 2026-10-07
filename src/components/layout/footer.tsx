import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Footer() {
  return (
    <footer className="mt-auto bg-page px-4 pt-6.75 pb-8.5 sm:px-8.5">
      <div className="flex flex-col gap-5">
        <hr className="h-px border-0 bg-raised" />
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-3">
          <Logo size="sm" />
          <div className="flex-1" />
          <ThemeToggle />
          <p className="text-body-s text-fg-secondary">
            © {new Date().getFullYear()} Kino XII. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
