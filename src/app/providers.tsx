"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useSessionBootstrap } from "@/features/auth/hooks";
import { createQueryClient } from "@/lib/query/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  useSessionBootstrap();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
