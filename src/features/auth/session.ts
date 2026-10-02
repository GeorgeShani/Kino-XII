import { isApiError } from "@/lib/api/errors";
import { tokenStorage } from "@/lib/api/token";
import { fetchCurrentUser } from "./api";
import { useAuthStore } from "./store";

export async function restoreSession(signal?: AbortSignal) {
  const { setUser, setGuest, clearSession } = useAuthStore.getState();

  if (!tokenStorage.get()) {
    setGuest();
    return;
  }

  try {
    setUser(await fetchCurrentUser(signal));
  } catch (error) {
    if (signal?.aborted) return;
    if (isApiError(error, "unauthenticated")) clearSession();
    else setGuest();
  }
}

export function recoverFromUnauthenticated() {
  const { clearSession, requestLogin } = useAuthStore.getState();
  clearSession();
  return requestLogin();
}
