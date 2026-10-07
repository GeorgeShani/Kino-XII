import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import type { AuthPayload } from "@/types/api";
import { login, logout, register } from "./api";
import { useAuthStore } from "./store";

function useStartSession() {
  const queryClient = useQueryClient();

  return (payload: AuthPayload) => {
    useAuthStore.getState().setSession(payload);
    void queryClient.invalidateQueries();
  };
}

export function useLogin() {
  const onSuccess = useStartSession();
  return useMutation({ mutationFn: login, onSuccess });
}

export function useRegister() {
  const onSuccess = useStartSession();
  return useMutation({ mutationFn: register, onSuccess });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      useAuthStore.getState().clearSession();
      void queryClient.invalidateQueries();
      if (pathname.startsWith("/profile")) router.replace("/");
    },
  });
}
