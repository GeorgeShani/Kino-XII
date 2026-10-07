import { create } from "zustand";

interface BookingGateState {
  profileNoticeOpen: boolean;
  showProfileNotice: () => void;
  hideProfileNotice: () => void;
}

export const useBookingGateStore = create<BookingGateState>((set) => ({
  profileNoticeOpen: false,
  showProfileNotice: () => set({ profileNoticeOpen: true }),
  hideProfileNotice: () => set({ profileNoticeOpen: false }),
}));
