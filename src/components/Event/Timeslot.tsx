import { IonButton } from "@ionic/react";
import { addMinutes, format } from "date-fns";

import { buildStartTime } from "../../domains/date/timezone";
import useCommitToTimeslot from "../../mutations/commitToTimeslot";
import { useEventByIdQuery, useTimeslotByIdQuery } from "../../queries/projectById";
import { useModals } from "../../router";

type Props = {
  committed: boolean;
  currentUserId?: string;
  event: Exclude<ReturnType<typeof useEventByIdQuery>['data'], undefined>;
  timeslot: Exclude<ReturnType<typeof useTimeslotByIdQuery>['data'], undefined>;
}

export default function Timeslot({ committed, currentUserId, event, timeslot }: Props) {
  const modals = useModals();
  const startTime = buildStartTime(event.project_event_date, event.timezone, timeslot);
  const endTime = addMinutes(startTime, timeslot.timeslot_duration_minutes);
  const span = `${format(startTime, 'h:mm bbb')} - ${format(endTime, 'h:mm bbb')}`;

  const timeslotCommit = useCommitToTimeslot({
    projectId: event.project_id
  });

  return (
    <div className="bg-gray-200 p-2 rounded mb-1 flex justify-between gap-4">
      <div>
        <div>{timeslot.role}</div>
        <div>{span}</div>
      </div>
      <div>
        {!committed && currentUserId && <IonButton
          disabled={timeslotCommit.isPending}
          color='secondary'
          onClick={() => {
            timeslotCommit.mutate({
              projectId: event.project_id,
              startTime,
              endTime,
              currentUserId,
              eventId: event.id,
            })
          }}
        >Commit</IonButton>}
        {!currentUserId && <IonButton
          disabled={timeslotCommit.isPending}
          color='secondary'
          onClick={() => {
            modals.open('/profile')
          }}
        >Commit</IonButton>}
      </div>
    </div>
  )
}
