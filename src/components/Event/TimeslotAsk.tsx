import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { personOutline, trashOutline } from 'ionicons/icons';

import { useState } from 'react';

import { showToast } from '../../domains/ui/toast';
import { Timeslot } from '../../mutations/createTimeslots';

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

function findDuration(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
): number {
  const endMinutes = endHour * 60 + endMinute;
  const startMinutes = startHour * 60 + startMinute;
  return endMinutes - startMinutes;
}

type Props = {
  timeslots: Timeslot[];
  setTimeslots: (timeslots: Timeslot[]) => void;
  timeslot: Timeslot;
  index: number;
}

export default function TimeslotAsk({
  timeslot,
  index,
  timeslots,
  setTimeslots
}: Props) {
  const [endHour, setEndHour] = useState((timeslot.hour + Math.floor((timeslot.duration) / 60)));
  const [endMinute, setEndMinute] = useState((timeslot.minute + timeslot.duration) % 60);
  const countString = timeslot.count.toString();
  const minimumCountString = timeslot.minimumCount.toString();

  return (
    <div className='flex gap-6 items-center self-center'>
      <div className='flex flex-col gap-2'>
        <IonItem>
          <IonLabel className='pr-2'>Role</IonLabel>
          <IonInput
            value={timeslot.role}
            onIonChange={e => {
              setTimeslots(
                (index === 0 ? [] : timeslots.slice(0, index))
                  .concat([
                    {
                      count: timeslot.count,
                      duration: timeslot.duration,
                      hour: timeslot.hour,
                      minimumCount: timeslot.minimumCount,
                      minute: timeslot.minute,
                      role: e.detail.value as string,
                    }
                  ],
                    (timeslots.length > index + 1 ? timeslots.slice(index + 1) : [])
                  ))
            }}
          />
        </IonItem>
        <IonItem>
          <IonSelect
            label="Start time"
            value={timeslot.hour}
            onIonChange={e => {
              setEndHour((e.detail.value + Math.floor((timeslot.duration) / 60)));
              setEndMinute((timeslot.minute + timeslot.duration) % 60);
              setTimeslots(
                (index === 0 ? [] : timeslots.slice(0, index))
                  .concat([
                    {
                      count: timeslot.count,
                      duration: timeslot.duration,
                      hour: e.detail.value,
                      minimumCount: timeslot.minimumCount,
                      minute: timeslot.minute,
                      role: timeslot.role,
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
                      count: timeslot.count,
                      duration: findDuration(timeslot.hour, e.detail.value as number,
                        endHour, endMinute),
                      hour: timeslot.hour,
                      minimumCount: timeslot.minimumCount,
                      minute: e.detail.value,
                      role: timeslot.role,
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
        </IonItem>

        <IonItem>
          <IonSelect
            label="End time"
            value={endHour}
            onIonChange={e => {
              setEndHour(e.detail.value as number);
              setTimeslots(
                (index === 0 ? [] : timeslots.slice(0, index))
                  .concat([
                    {
                      count: timeslot.count,
                      duration: findDuration(timeslot.hour, timeslot.minute,
                        e.detail.value as number, endMinute),
                      hour: timeslot.hour,
                      minimumCount: timeslot.minimumCount,
                      minute: timeslot.minute,
                      role: timeslot.role,
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
            value={endMinute}
            onIonChange={e => {
              setEndMinute(e.detail.value as number);
              setTimeslots(
                (index === 0 ? [] : timeslots.slice(0, index))
                  .concat([
                    {
                      count: timeslot.count,
                      duration: findDuration(timeslot.hour, timeslot.minute,
                        endHour, e.detail.value as number),
                      hour: timeslot.hour,
                      minimumCount: timeslot.minimumCount,
                      minute: timeslot.minute,
                      role: timeslot.role,
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
        </IonItem>

        <IonItem>
          <IonLabel className='whitespace-nowrap'>
            Min persons<IonIcon className='pl-2 pr-2' icon={personOutline} /></IonLabel>
          <IonInput
            value={!minimumCountString || minimumCountString === '0' ? '' : minimumCountString}
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
                        count: timeslot.count,
                        duration: timeslot.duration,
                        hour: timeslot.hour,
                        minimumCount: newInt || 0,
                        minute: timeslot.minute,
                        role: timeslot.role,
                      }
                    ],
                      (timeslots.length > index + 1 ? timeslots.slice(index + 1) : [])
                    ))
              } catch (e) {
                console.log('Error parsing int', e)
              }
            }}
          />
        </IonItem>

        <IonItem>
          <IonLabel className='whitespace-nowrap'>
            Max persons<IonIcon className='pl-2 pr-2' icon={personOutline} /></IonLabel>
          <IonInput
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
                        count: newInt || 0,
                        duration: timeslot.duration,
                        hour: timeslot.hour,
                        minimumCount: timeslot.minimumCount,
                        minute: timeslot.minute,
                        role: timeslot.role,
                      }
                    ],
                      (timeslots.length > index + 1 ? timeslots.slice(index + 1) : [])
                    ))
              } catch (e) {
                console.log('Error parsing int', e)
              }
            }}
          />
        </IonItem>
      </div>

      <div>
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
    </div>
  )
}
