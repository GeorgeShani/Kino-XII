import { requireAuth } from "@/features/auth/gate";
import { useAuthStore } from "@/features/auth/store";
import { useBookingGateStore } from "./gate-store";

export function startBooking(sessionId: number, open: (id: number) => void) {
  return requireAuth(() => {
    const user = useAuthStore.getState().user;

    if (user && !user.profileComplete) {
      useBookingGateStore.getState().showProfileNotice();
      return;
    }
    open(sessionId);
  });
}
