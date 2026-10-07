"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { CloseIcon } from "./icons";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  label?: string;
  showCloseButton?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  label,
  showCloseButton = true,
  className,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : label}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100vw-2rem)] bg-transparent p-0 text-fg sm:w-fit"
    >
      {open && (
        <div
          className={cn(
            "relative flex max-h-[calc(100dvh-2rem)] max-w-full flex-col gap-6 overflow-y-auto rounded-[28px] bg-page inset-ring-1 inset-ring-raised p-6 shadow-modal sm:p-8",
            className,
          )}
        >
          {showCloseButton && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-6 right-6 grid size-6 place-items-center rounded-full text-fg-secondary transition-colors duration-300 ease-out hover:text-fg sm:top-8 sm:right-8"
            >
              <CloseIcon className="size-6" />
            </button>
          )}
          {(title || description) && (
            <header className="flex flex-col gap-2 pr-10">
              {title && (
                <h2 id={titleId} className="text-h2">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-body-s text-fg-secondary">{description}</p>
              )}
            </header>
          )}
          {children}
        </div>
      )}
    </dialog>
  );
}
