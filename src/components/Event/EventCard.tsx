import { IonButton } from '@ionic/react';
import { format } from 'date-fns';

import useRemoveCommitment from '../../mutations/removeCommitment';
import { useEventByIdQuery } from "../../queries/projectById";
import { useModals } from "../../router";

import Timeslot from './Timeslot';

type Props = {
  currentUserId?: string;
  event: Exclude<ReturnType<typeof useEventByIdQuery>['data'], undefined>;
  canEdit: boolean;
}

export default function EventCard({ currentUserId, event, canEdit }: Props) {
  const modals = useModals();
  const removeCommitment = useRemoveCommitment({ projectId: event.project_id });

  const myCommitments = event.project_event_commitment.filter(i => i.created_by === currentUserId);
  const committed = myCommitments.length > 0;

  return (
    <div className="border border-gray-300 rounded-lg p-4 my-4 shadow-sm
      max-h-[60vh] overflow-auto">
      <div key={event.id} className="flex flex-col gap-2">
        <div className="text-lg font-bold">{event.location_name}</div>
        <div className="text-lg font-bold">{event.project_event_date}</div>
        <div>
          {committed && <div className='border-2 p-2 mb-6'>
            <div className='text-2xl'>GOING</div>
            <div>{myCommitments.map(commitment => {
              return <div key={commitment.id} className='flex justify-between items-center'>
                <div>
                  <div>{commitment.role}</div>
                  <div>
                    {format(commitment.commitment_start, 'h:mm bbb')}
                    {' - '}
                    {format(commitment.commitment_end, 'h:mm bbb')}
                  </div>
                </div>
                <div>
                  <IonButton
                    disabled={removeCommitment.isPending}
                    color='danger'
                    onClick={() => {
                      removeCommitment.mutate({ id: commitment.id, projectId: event.project_id })
                    }}
                  >X</IonButton>
                </div>
              </div>
            })}</div>
          </div>}
          {event.project_event_timeslot.map((timeslot, index) =>
            <Timeslot key={index}
              currentUserId={currentUserId}
              timeslot={timeslot}
              committed={committed}
              event={event} />)}
        </div>
        {canEdit && (
          <div className='border-2 border-[#6030ff] border-rounded p-2'>
            <div className='text-xl'>
              {`Who's going`}
            </div>
            <div>
              {event.project_event_commitment.length === 0 && 'No one is going yet'}
              {event.project_event_commitment.map(commitment => {
                return <div key={commitment.id} className='flex justify-between items-center gap-2'>
                  <div>{commitment.role}</div>
                  <div>
                    {format(commitment.commitment_start, 'h:mm bbb')}
                    {' - '}
                    {format(commitment.commitment_end, 'h:mm bbb')}
                  </div>
                </div>
              })}
            </div>
          </div>
        )}
        {canEdit && (
          <IonButton
            color='tertiary'
            onClick={() => {
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
