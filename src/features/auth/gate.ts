import { useAuthStore } from "./store";

function waitForSessionRestore() {
  return new Promise<void>((resolve) => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      if (state.status === "restoring") return;
      unsubscribe();
      resolve();
    });
  });
}

export async function requireAuth(action: () => void) {
  const store = useAuthStore.getState();
  if (store.status === "restoring") await waitForSessionRestore();

  if (useAuthStore.getState().status !== "authenticated") {
    try {
      await useAuthStore.getState().requestLogin();
    } catch {
      return;
    }
  }

  action();
}
