import { IonButton } from '@ionic/react';
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";

import { sessionStore } from "../../domains/auth/sessionStore";
import { useNavigate } from "../../router";

type Props = {
  eventId: string;
  projectId: string;
  userId?: string;
}

const buttons = [
  { value: 5, label: '5 Minutes' },
  { value: 10, label: '10 Minutes' },
  { value: 15, label: '15 Minutes' },
  { value: 30, label: '30 Minutes' },
  { value: 45, label: '45 Minutes' },
  { value: 60, label: '1 Hour' },
  { value: 90, label: '1.5 Hours' },
  { value: 120, label: '2 Hours' },
  { value: 150, label: '2.5 Hours' },
  { value: 180, label: '3 Hours' },
  { value: 240, label: '4 Hours' },
  { value: 300, label: '5 Hours' },
  { value: 360, label: '6 Hours' },
  { value: 480, label: '8 Hours' },
  { value: 600, label: '10 Hours' },
  { value: 720, label: '12 Hours' },
  { value: 840, label: '14 Hours' },
  { value: 960, label: '16 Hours' },
  { value: 1200, label: '20 Hours' },
  { value: 1440, label: '24 Hours' },
];

export function AskComponent({ eventId, projectId, userId }: Props) {
  const [activeValue, setActiveValue] = useState<number>(60); // Default active value
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [timeslots, setTimeslots] = useState<{ id: string, hour: number, minute: number }[]>([]);
  // const { mutate, isPending } = useCreateEvent({ projectId }, () => {
  //   navigate(-1)
  // });

  if (!userId) {
    return <div>You must login to create events.</div>
  }

  console.log('{projectId} {eventId}', { projectId }, { eventId })

  return (
    <div ref={modalRef}
      className='bg-white flex flex-col p-4 mb-6
    max-h-[calc(100vh-96px)] pointer-events-auto overflow-auto '>
      <div className='flex flex-col items-center'>
        <div>
          <div className='text-3xl'>Add timeslots</div>
          <div>Duration</div>
          {/* <IonButtons> */}
          <div className='flex flex-wrap max-w-[800px] justify-between max-h-[40vh] overflow-auto'>
            {buttons.map((button) => (
              <IonButton
                key={button.value}
                className='w-40'
                onClick={() => { setActiveValue(button.value) }}
                color={activeValue === button.value ? 'primary' : 'medium'} // Highlight active button
              >
                {button.label}
              </IonButton>
            ))}
          </div>
          <div>Time</div>
          {!timeslots.length && <div>No timeslots</div>}
          {timeslots.map(timeslot => {
            return (
              <div key={timeslot.id}>{timeslot.hour}:{timeslot.minute}</div>
            )
          })}
          <IonButton onClick={() => {
            const hour = 8;
            const minute = 0;
            setTimeslots(
              [...timeslots,
              { id: `${hour.toString()}:${minute.toString()}`, hour, minute }
              ]
            )
          }}>Add block</IonButton>
          <div>
            <button onClick={() => { navigate(-1) }}>CLOSE</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Ask = observer(({ projectId, eventId }: Omit<Props, 'userId'>) => {
  return <AskComponent
    projectId={projectId}
    eventId={eventId}
    userId={sessionStore.current?.user.id}
  />
})

export default Ask;
