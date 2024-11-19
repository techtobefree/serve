import { IonButton } from '@ionic/react';

import { useEventByIdQuery } from "../../queries/projectById";
import { useModals } from "../../router";

type Props = {
  event: ReturnType<typeof useEventByIdQuery>['data'];
  canEdit: boolean;
}

export default function EventCard({ event, canEdit }: Props) {
  const modals = useModals();

  if (!event) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 my-4 shadow-sm
      max-h-[40vh] overflow-auto">
      <div key={event.id} className="flex flex-col gap-2">
        <div className="text-lg font-bold">{event.location_name}</div>
        <div className="text-lg font-bold">{event.project_event_date}</div>
        <div className="mt-2">
          {event.project_event_timeslot.map((timeslot, index) => (
            <div key={index} className="bg-gray-200 p-2 rounded mb-1">
              {timeslot.role}
            </div>
          ))}
        </div>
        {canEdit && (
          <IonButton onClick={() => {
            modals.open('/project/[projectId]/ask', {
              params: { projectId: event.project_id }, state: {
                eventId: event.id
              }
            })
          }}>
            Add Timeslot
          </IonButton>
        )}
      </div>
    </div>
  )
}
