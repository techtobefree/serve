import { IonButton } from "@ionic/react";
import { addMinutes, format } from "date-fns";

import { buildStartTime } from "../../domains/date/timezone";
import useCommitToTimeslot from "../../domains/project/commitment/mutationCommitToTimeslot";
import useRemoveTimeslot from "../../domains/project/event/mutationRemoveTimeslot";
import {
  useEventByIdQuery,
  useSurveyByIdQuery,
  useTimeslotByIdQuery
} from "../../domains/project/queryProjectById";
import { useModals } from "../../router";

type Props = {
  canEdit: boolean;
  committed: boolean;
  currentUserId?: string;
  event: Exclude<ReturnType<typeof useEventByIdQuery>['data'], undefined>;
  survey: ReturnType<typeof useSurveyByIdQuery>['data'] | null;
  timeslot: Exclude<ReturnType<typeof useTimeslotByIdQuery>['data'], undefined>;
}

export default function Timeslot({
  canEdit,
  committed,
  currentUserId,
  event,
  survey,
  timeslot
}: Props) {
  const modals = useModals();
  const startTime = buildStartTime(event.project_event_date, event.timezone, timeslot);
  const endTime = addMinutes(startTime, timeslot.timeslot_duration_minutes);
  const span = `${format(startTime, 'h:mm bbb')} - ${format(endTime, 'h:mm bbb')}`;
  const deleteTimeslot = useRemoveTimeslot({ projectId: event.project_id });

  const timeslotCommit = useCommitToTimeslot({
    projectId: event.project_id
  });

  return (
    <div className="bg-gray-200 p-2 rounded mb-1 flex justify-between gap-4">
      <div>
        <div>{timeslot.role}</div>
        <div>{span}</div>
      </div>
      <div className='flex'>
        {!committed && <IonButton
          disabled={timeslotCommit.isPending}
          color='secondary'
          onClick={() => {
            if (!currentUserId) {
              modals.open('/menu')
            } else {
              if (survey) {
                modals.open('/timeslotSurvey', {
                  state: {
                    survey, projectId: event.project_id, timeslotCommitment: {
                      projectId: event.project_id,
                      startTime,
                      endTime,
                      eventId: event.id,
                    }
                  }
                });
              } else {
                timeslotCommit.mutate({
                  projectId: event.project_id,
                  startTime,
                  endTime,
                  eventId: event.id,
                })
              }
            }
          }}
        >Commit</IonButton>}
        {canEdit && (
          <IonButton
            color='tertiary'
            onClick={() => {
              deleteTimeslot.mutate({ id: timeslot.id, projectId: event.project_id });
            }}
          >Delete</IonButton>
        )}
      </div>
    </div>
  )
}
