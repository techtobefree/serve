import { IonButton, IonIcon } from '@ionic/react';
import { format } from 'date-fns';

import { copy } from 'ionicons/icons';

import { buildTZDateFromDB, formatDateLLLLddyyyy } from '../../domains/date/timezone';
import { IMAGE_SIZE } from '../../domains/image';
import { showToast } from '../../domains/ui/toast';
import useRemoveCommitment from '../../mutations/removeCommitment';
import useRemoveEvent from '../../mutations/removeEvent';
import { getPublicUrl, profilePicturePath } from '../../queries/image';
import { useEventByIdQuery, useProjectByIdQuery } from "../../queries/projectById";
import { useModals, useNavigate } from "../../router";

import Avatar from '../Avatar';

import AddCalendarEventButton from '../Calendar';

import Timeslot from './Timeslot';

type ProjectEvent = Exclude<ReturnType<typeof useEventByIdQuery>['data'], undefined>

type Props = {
  currentUserId?: string;
  event: ProjectEvent;
  project: Exclude<ReturnType<typeof useProjectByIdQuery>['data'], undefined>;
  canEdit: boolean;
}

function getEventAddressAsText(event: ProjectEvent) {
  const parts = [];
  if (event.location_name) {
    parts.push(event.location_name);
  }
  if (event.street_address && event.location_name !== event.street_address) {
    parts.push(event.street_address);
  }
  return `${parts.join(' ')} ${event.city ?
    event.city + ', ' : ''}${event.state || ''} ${event.state && event.postal_code ?
      ' ' + event.postal_code :
      event.postal_code || ''}`;
}

export default function EventCard({ currentUserId, event, project, canEdit }: Props) {
  const navigate = useNavigate();
  const modals = useModals();
  const removeCommitment = useRemoveCommitment({ projectId: event.project_id });
  const removeEvent = useRemoveEvent({ projectId: event.project_id });

  const myCommitments = event.project_event_commitment.filter(i => i.created_by === currentUserId);
  const committed = myCommitments.length > 0;

  return (
    <div className="border border-gray-300 rounded-lg p-4 w-full">
      <div key={event.id} className="flex flex-col">
        <div className='flex justify-between'>
          <div className="text-lg">
            {formatDateLLLLddyyyy(buildTZDateFromDB(event.project_event_date).toDateString())}
          </div>
          {canEdit && (
            <IonButton color='tertiary'
              onClick={() => {
                removeEvent.mutate({ id: event.id, projectId: event.project_id })
              }}>Delete Event</IonButton>
          )}
        </div>
        <div className="text-lg">
          {
            (event.location_name || event.street_address) && (
              <div className='flex gap-1 cursor-pointer' onClick={() => {
                void navigator.clipboard.writeText(getEventAddressAsText(event));
                showToast('Address copied to clipboard');
              }}>
                <div>{event.location_name || event.street_address}</div>
                <div><IonIcon className='text-gray-400' icon={copy} /></div>
              </div>
            )
          }
          <div>
            {event.location_name ?
              event.location_name !== event.street_address ?
                event.street_address : ''
              : ''}
          </div>
          <div>
            {`${event.city || 'MISSING CITY'}, ${event.state ||
              'MISSING STATE'} ${event.postal_code || ''}`}
          </div>
        </div>
        <div className='max-h-[60vh] overflow-auto'>
          <div>
            {committed && <div className='border-2 p-2 mb-6'>
              <div className='text-2xl'>{`I'm going`}</div>
              <div>{myCommitments.map(commitment => {
                return <div key={commitment.id} className='flex justify-between items-center gap-2'>
                  <div>
                    <AddCalendarEventButton
                      start={commitment.commitment_start}
                      end={commitment.commitment_end}
                      title={project.name}
                      location={getEventAddressAsText(event)}
                      details={project.description || ''} />
                  </div>
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
                canEdit={canEdit}
                currentUserId={currentUserId}
                timeslot={timeslot}
                committed={committed}
                event={event} />)}
          </div>
          <div className='border-rounded p-2'>
            <div className='text-xl'>
              {`Who's going`}
            </div>
            <div>
              {event.project_event_commitment.length === 0 && 'No one is going yet'}
              {event.project_event_commitment.map((commitment, index) => {
                return (
                  <div
                    key={commitment.id}
                    className={`flex justify-between items-center gap-2 pl-6 pr-6 -ml-6 -mr-6
                  ${index % 2 === 0 ? 'bg-[#ddd]' : ''}`}>

                    <div className='cursor-pointer'
                      onClick={() => {
                        navigate('/user/:userId/view',
                          { params: { userId: commitment.created_by } })
                      }}>
                      <Avatar
                        size={IMAGE_SIZE.AVATAR_SMALL}
                        alt={commitment.profile?.handle || 'Volunteer Photo'}
                        src={getPublicUrl(profilePicturePath(commitment.created_by))} />
                    </div>
                    <div>{(commitment.profile as unknown as { handle: string }).handle}</div>
                    <div>
                      <div>{commitment.role}</div>
                      <div>
                        {format(commitment.commitment_start, 'h:mm bbb')}
                        {' - '}
                        {format(commitment.commitment_end, 'h:mm bbb')}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
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
    </div>
  )
}
