"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { UploadIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils/cn";

interface AvatarUploadProps {
  value?: File;
  onChange: (file: File | undefined) => void;
  error?: string;
}

export function AvatarUpload({ value, onChange, error }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => {
    if (!value?.type.startsWith("image/")) {
      setPreviewUrl(undefined);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <label className="flex w-fit cursor-pointer items-center gap-3">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="peer sr-only"
          onChange={(event) => {
            onChange(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border-[0.5px] border-dashed border-raised bg-tint-white text-fg-disabled",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-red",
          )}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar preview"
              width={40}
              height={40}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <UploadIcon />
          )}
        </span>
        <span className="flex flex-col gap-0.75">
          <span className="text-button">Upload avatar (optional)</span>
          <span className="text-body-s text-fg-secondary">
            JPG, PNG or WEBP
          </span>
        </span>
      </label>
      {error && <p className="text-label-s text-red">{error}</p>}
    </div>
  );
}
