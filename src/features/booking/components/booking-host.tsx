"use client";

import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";
import { buttonStyles } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useBookingGateStore } from "../gate-store";
import { BookingModal } from "./booking-modal";

export function BookingHost() {
  const [sessionId, setSessionId] = useQueryState("session", parseAsInteger);
  const profileNoticeOpen = useBookingGateStore(
    (state) => state.profileNoticeOpen,
  );
  const hideProfileNotice = useBookingGateStore(
    (state) => state.hideProfileNotice,
  );

  const closeBooking = () => setSessionId(null);

  return (
    <>
      <Modal
        open={sessionId !== null}
        onClose={closeBooking}
        label="Book tickets"
        showCloseButton={false}
        className="w-286.5 gap-8 inset-ring-fg-disabled"
      >
        {sessionId !== null && (
          <BookingModal sessionId={sessionId} onClose={closeBooking} />
        )}
      </Modal>

      <Modal
        open={profileNoticeOpen}
        onClose={hideProfileNotice}
        title="Complete your profile"
        description="Add your full name, mobile number and date of birth to your profile before booking tickets."
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href="/profile"
            onClick={hideProfileNotice}
            className={buttonStyles({ variant: "primary" })}
          >
            Go to profile
          </Link>
          <button
            type="button"
            onClick={hideProfileNotice}
            className={buttonStyles({ variant: "transparent" })}
          >
            Not now
          </button>
        </div>
      </Modal>
    </>
  );
}
