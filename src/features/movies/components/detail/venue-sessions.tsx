import type { Session, VenueSessions } from "@/types/api";
import { SessionTicket } from "./session-ticket";

interface VenueSessionsProps {
  group: VenueSessions;
  selectedSessionId: number | null;
  ageBlocked: boolean;
  onSelect: (session: Session) => void;
}

function groupByHall(sessions: Session[]) {
  const halls = new Map<number, { name: string; sessions: Session[] }>();

  for (const session of sessions) {
    const hall = halls.get(session.hall.id) ?? {
      name: session.hall.name,
      sessions: [],
    };
    hall.sessions.push(session);
    halls.set(session.hall.id, hall);
  }

  return [...halls.entries()];
}

export function VenueSessionsGroup({
  group,
  selectedSessionId,
  ageBlocked,
  onSelect,
}: VenueSessionsProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-button">{group.venue.name}</h3>
      <div className="flex flex-wrap gap-2.5">
        {groupByHall(group.sessions).map(([hallId, hall]) => (
          <div
            key={hallId}
            className="flex flex-col gap-2.25 rounded-[18px] bg-card p-3.75 inset-ring-1 inset-ring-raised"
          >
            <h4 className="text-label-s">Hall {hall.name}</h4>
            <div className="flex flex-wrap gap-2.25">
              {hall.sessions.map((session) => (
                <SessionTicket
                  key={session.id}
                  session={session}
                  selected={session.id === selectedSessionId}
                  disabled={ageBlocked}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
