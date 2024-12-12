import {
  IonButton,
  IonIcon,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { personOutline, trashOutline } from 'ionicons/icons';

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
  const countString = timeslot.count.toString();

  return (
    <div className='flex gap-2 items-center
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
}
