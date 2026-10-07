"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDragScroll } from "@/lib/hooks/use-drag-scroll";
import { cn } from "@/lib/utils/cn";

interface ScrollRowProps {
  gap: "gap-4.25" | "gap-5";
  children: React.ReactNode;
}

export function ScrollRow({ gap, children }: ScrollRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(false);

  useDragScroll(scrollerRef);

  const update = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setHasMore(
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;

    update();
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    observer.observe(track);
    return () => observer.disconnect();
  }, [update]);

  return (
    <div className="relative -mr-4 sm:-mr-8 xl:-mr-17.5">
      <div
        ref={scrollerRef}
        onScroll={update}
        className="-my-2 overflow-x-auto py-2 pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:pr-8 xl:pr-17.5"
      >
        <div ref={trackRef} className={cn("flex w-max", gap)}>
          {children}
        </div>
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-44 bg-linear-to-l from-page to-transparent transition-opacity duration-300",
          hasMore ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
