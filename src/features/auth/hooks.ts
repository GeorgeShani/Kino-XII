"use client";

import { useEffect } from "react";
import { setUnauthenticatedHandler } from "@/lib/api/client";
import { recoverFromUnauthenticated, restoreSession } from "./session";

export function useSessionBootstrap() {
  useEffect(() => {
    const controller = new AbortController();

    setUnauthenticatedHandler(recoverFromUnauthenticated);
    void restoreSession(controller.signal);

    return () => {
      controller.abort();
      setUnauthenticatedHandler(null);
    };
  }, []);
}
