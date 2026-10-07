"use client";

import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useEffect, useState } from "react";
import { AuthModals } from "@/features/auth/components/auth-modals";
import { useSessionBootstrap } from "@/features/auth/hooks";
import { filterOptionsQuery } from "@/features/sessions/hooks";
import { createQueryClient } from "@/lib/query/query-client";

function Bootstrap() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.query(filterOptionsQuery).catch(() => {});
  }, [queryClient]);

  useSessionBootstrap();

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <Bootstrap />
        {children}
        <AuthModals />
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
