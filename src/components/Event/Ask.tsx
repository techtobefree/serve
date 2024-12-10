import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { closeOutline, personOutline, trashOutline } from 'ionicons/icons';
import { observer } from "mobx-react-lite";
import { useState } from "react";

import { sessionStore } from "../../domains/auth/sessionStore";
import { showToast } from '../../domains/ui/toast';
import useCreateTimeslots, { Timeslot } from '../../mutations/createTimeslots';
import { useNavigate } from "../../router";

type Props = {
  eventId: string;
  projectId: string;
  userId?: string;
}

const buttons = [
  { value: 10, label: '10 Minutes' },
  { value: 30, label: '30 Minutes' },
  { value: 60, label: '1 Hour' },
  { value: 120, label: '2 Hours' },
  { value: 480, label: '8 Hours' },
  { value: 1440, label: '24 Hours' },
];

const hours = [
  { value: 0, label: '12 AM' },
  { value: 1, label: '1 AM' },
  { value: 2, label: '2 AM' },
  { value: 3, label: '3 AM' },
  { value: 4, label: '4 AM' },
  { value: 5, label: '5 AM' },
  { value: 6, label: '6 AM' },
  { value: 7, label: '7 AM' },
  { value: 8, label: '8 AM' },
  { value: 9, label: '9 AM' },
  { value: 10, label: '10 AM' },
  { value: 11, label: '11 AM' },
  { value: 12, label: '12 PM' },
  { value: 13, label: '1 PM' },
  { value: 14, label: '2 PM' },
  { value: 15, label: '3 PM' },
  { value: 16, label: '4 PM' },
  { value: 17, label: '5 PM' },
  { value: 18, label: '6 PM' },
  { value: 19, label: '7 PM' },
  { value: 20, label: '8 PM' },
  { value: 21, label: '9 PM' },
  { value: 22, label: '10 PM' },
  { value: 23, label: '11 PM' },
];

const minutes = Array.from({ length: 60 }, (_, i) => i).map(i => {
  return {
    value: i,
    label: i.toString().padStart(2, '0')
  }
});

function nextTimeSlot(duration: number, hour?: number, minute?: number, count?: number): Timeslot {
  if (hour === undefined || minute === undefined) {
    return {
      hour: 18,
      minute: 0,
      count: 0
    }
  }

  const nextMinute = minute + duration;
  const nextHour = hour + Math.floor(nextMinute / 60);
  return {
    hour: nextHour % 24,
    minute: nextMinute % 60,
    count: count || 0
  }
}

export function AskComponent({ eventId, projectId, userId }: Props) {
  const [activeValue, setActiveValue] = useState<number>(60); // Default active value
  const navigate = useNavigate();
  const [timeslots, setTimeslots] = useState<Timeslot[]>([nextTimeSlot(activeValue)]);
  const { mutate, isPending } = useCreateTimeslots({ projectId }, () => {
    navigate(-1)
  });

  if (!userId) {
    return <div>You must login to create events.</div>
  }


  return (
    <div
      className='bg-white flex flex-col p-4 mb-6
    max-h-[calc(100vh-96px)] pointer-events-auto overflow-auto '>
      <div className='flex flex-col items-center'>
        <div>
          <div className='flex items-center mb-8 justify-between w-full'>
            <div className='text-4xl'>Add timeslots</div>
            {/* Close Button */}
            <IonIcon className="text-4xl cursor-pointer"
              icon={closeOutline} onClick={() => { navigate(-1) }} />
          </div>
          <IonItem style={{ marginLeft: '-16px' }}>
            <IonInput label='Duration'
              value={activeValue.toString()}
              onIonChange={(e) => {
                const newValue = e.detail.value
                try {
                  const newInt = parseInt(newValue as string)
                  if (newInt < 0 || isNaN(newInt)) {
                    throw new Error('Please enter a positive number.')
                  }
                  setActiveValue(newInt)
                } catch (e) {
                  showToast('Please enter a valid number', { duration: 5000, isError: true })
                  console.log('Error parsing int', e)
                  setActiveValue(60)
                }
              }}
            />
          </IonItem>
          {/* <IonButtons> */}
          <div className='flex flex-wrap max-w-[650px] justify-between max-h-[40vh] overflow-auto'>
            {buttons.map((button) => (
              <IonButton
                key={button.value}
                className='w-40'
                onClick={() => { setActiveValue(button.value) }}
                color={activeValue === button.value ? 'secondary' : 'medium'} // Highlight active button
              >
                {button.label}
              </IonButton>
            ))}
          </div>
          <br />
          <br />
          {!timeslots.length && <div>No timeslots</div>}
          <div className='flex flex-col gap-2'>
            {timeslots.sort((a, b) => {
              // Feel free to make this readable
              return a.hour < b.hour ? -1 : a.hour > b.hour ?
                1 : a.minute < b.minute ? -1 : a.minute > b.minute ? 1 : 0
            }).map((timeslot, index) => {
              const hourString = timeslot.hour.toString();
              const minuteString = timeslot.hour.toString();
              const countString = timeslot.count.toString();
              const id = `${index.toString()}${hourString}${minuteString}`;

              return (
                <div key={id} className='flex gap-2 items-center
                  border-b border-gray-300 border-bottom h-[45px]'>
                  <IonSelect
                    label="Time"
                    value={timeslot.hour}
                    onIonChange={e => {
                      setTimeslots(
                        (index === 0 ? [] : timeslots.slice(0, index))
                          .concat([
                            {
                              hour: e.detail.value,
                              minute: timeslot.minute,
                              count: timeslot.count
                            }
                          ],
                            (timeslots.length > index + 1 ? timeslots.slice(index + 1) : [])
                          ))
                    }}
                  >
                    {hours.map(hour => {
                      return (
                        <IonSelectOption key={hour.value} value={hour.value}>
                          {hour.label}
                        </IonSelectOption>
                      );
                    })}
                  </IonSelect>
                  <IonSelect
                    value={timeslot.minute}
                    onIonChange={e => {
                      setTimeslots(
                        (index === 0 ? [] : timeslots.slice(0, index))
                          .concat([
                            {
                              hour: timeslot.hour,
                              minute: e.detail.value,
                              count: timeslot.count
                            }
                          ],
                            (timeslots.length > index + 1 ? timeslots.slice(index + 1) : [])
                          ))
                    }}
                  >
                    {minutes.map(minute => {
                      return (
                        <IonSelectOption key={minute.value} value={minute.value}>
                          {minute.label}
                        </IonSelectOption>
                      );
                    })}
                  </IonSelect>
                  <div className='flex items-center gap-2 relative'>
                    <IonLabel><IonIcon icon={personOutline} /></IonLabel>
                    <IonInput
                      itemID={id}
                      value={!countString || countString === '0' ? '' : countString}
                      placeholder='∞'
                      onIonChange={e => {
                        try {
                          const newInt = parseInt(e.detail.value as string)
                          if (newInt < 0) {
                            showToast('Please enter a positive number',
                              { duration: 5000, isError: true })
                            return
                          }
                          setTimeslots(
                            (index === 0 ? [] : timeslots.slice(0, index))
                              .concat([
                                {
                                  hour: timeslot.hour,
                                  minute: timeslot.minute,
                                  count: newInt || 0
                                }
                              ],
                                (timeslots.length > index + 1 ? timeslots.slice(index + 1) : [])
                              ))
                        } catch (e) {
                          console.log('Error parsing int', e)
                        }
                      }}
                    />
                  </div>
                  <IonButton
                    color='danger'
                    onClick={() => {
                      setTimeslots(
                        (index === 0 ? [] : timeslots.slice(0, index))
                          .concat(
                            (timeslots.length > index + 1 ? timeslots.slice(index + 1) : [])
                          ))
                    }}><IonIcon icon={trashOutline} /></IonButton>

                </div>
              )
            })}
          </div>
          <IonButton
            color='secondary'
            onClick={() => {
              const last = timeslots[timeslots.length - 1] || {};
              const newTimeslot = nextTimeSlot(activeValue, last.hour, last.minute, last.count)
              setTimeslots(
                [...timeslots,
                  newTimeslot
                ]
              )
            }}>Add block</IonButton>
          <div className='mt-8 w-full flex justify-end'>
            <IonButton
              size='large'
              color='secondary'
              onClick={() => {
                if (timeslots.length === 0) {
                  showToast('Please add at least one timeslot', { duration: 5000, isError: true })
                  return
                }
                mutate({ durationMinutes: activeValue, eventId, projectId, timeslots, userId })
              }} disabled={isPending}>Save</IonButton>
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
