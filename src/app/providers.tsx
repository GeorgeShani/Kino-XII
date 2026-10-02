"use client";

import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSessionBootstrap } from "@/features/auth/hooks";
import { filterOptionsQuery } from "@/features/sessions/hooks";
import { createQueryClient } from "@/lib/query/query-client";

function Bootstrap() {
  const queryClient = useQueryClient();

  useEffect(() => {
    void queryClient.prefetchQuery(filterOptionsQuery);
  }, [queryClient]);

  useSessionBootstrap();

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <Bootstrap />
      {children}
    </QueryClientProvider>
  );
}
