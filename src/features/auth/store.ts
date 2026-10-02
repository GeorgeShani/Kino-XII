import { create } from "zustand";
import { tokenStorage } from "@/lib/api/token";
import type { AuthPayload, User } from "@/types/api";

export type AuthModal = "login" | "register";
export type AuthStatus = "restoring" | "authenticated" | "guest";

interface PendingLogin {
  promise: Promise<void>;
  resolve: () => void;
  reject: () => void;
}

interface AuthState {
  user: User | null;
  status: AuthStatus;
  modal: AuthModal | null;
  pendingLogin: PendingLogin | null;
  setSession: (payload: AuthPayload) => void;
  setUser: (user: User) => void;
  setGuest: () => void;
  clearSession: () => void;
  openModal: (modal: AuthModal) => void;
  closeModal: () => void;
  requestLogin: () => Promise<void>;
}

function createPendingLogin(): PendingLogin {
  let resolve!: () => void;
  let reject!: () => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "restoring",
  modal: null,
  pendingLogin: null,

  setSession: ({ user, token }) => {
    tokenStorage.set(token);
    get().pendingLogin?.resolve();
    set({ user, status: "authenticated", modal: null, pendingLogin: null });
  },

  setUser: (user) => set({ user, status: "authenticated" }),

  setGuest: () => set({ user: null, status: "guest" }),

  clearSession: () => {
    tokenStorage.clear();
    set({ user: null, status: "guest" });
  },

  openModal: (modal) => set({ modal }),

  closeModal: () => {
    get().pendingLogin?.reject();
    set({ modal: null, pendingLogin: null });
  },

  requestLogin: () => {
    const existing = get().pendingLogin;
    if (existing) return existing.promise;

    const pendingLogin = createPendingLogin();
    set({ pendingLogin, modal: "login" });
    return pendingLogin.promise;
  },
}));
