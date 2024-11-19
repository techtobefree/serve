import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";

import { sessionStore } from "../../domains/auth/sessionStore";
import { useNavigate } from "../../router";

type Props = {
  eventId: string;
  projectId: string;
  userId?: string;
}

export function AskComponent({ eventId, projectId, userId }: Props) {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  // const { mutate, isPending } = useCreateEvent({ projectId }, () => {
  //   modals.close();
  // });

  if (!userId) {
    return <div>You must login to create events.</div>
  }

  return (
    <div ref={modalRef}
      className='bg-white flex flex-col p-4
    max-h-[calc(100vh-32px)] pointer-events-auto overflow-auto'>
      <div className='flex flex-col items-center'>
        <div>
          <div>Ask for {projectId} {eventId}</div>
          <div>
            <label>
              Start Time:
              <input
                type="time"
                value={startTime}
                onChange={(e) => { setStartTime(e.target.value) }}
              />
            </label>
            <label>
              Duration:
              <input
                type="number"
                value={duration}
                onChange={(e) => { setDuration(e.target.value) }}
              />
            </label>
          </div>
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
