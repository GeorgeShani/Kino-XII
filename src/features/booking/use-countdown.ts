import { useEffect, useRef, useState } from "react";

const TICK_MS = 250;

const remainingUntil = (expiresAt: string) =>
  Math.max(0, Date.parse(expiresAt) - Date.now());

export function formatCountdown(remainingMs: number) {
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function useCountdown(expiresAt: string | null, onExpire: () => void) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!expiresAt) {
      setRemainingMs(null);
      return;
    }

    let expired = false;

    const tick = () => {
      const remaining = remainingUntil(expiresAt);
      setRemainingMs(remaining);

      if (remaining === 0 && !expired) {
        expired = true;
        onExpireRef.current();
      }
    };

    tick();
    const interval = setInterval(tick, TICK_MS);
    document.addEventListener("visibilitychange", tick);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [expiresAt]);

  return remainingMs;
}
