import { Calendar } from '@awesome-cordova-plugins/calendar';

import { IonSelect, IonSelectOption } from '@ionic/react';

import { DEVICE, DEVICE_TYPE } from '../../domains/ui/device';
import { showToast } from '../../domains/ui/toast';

type CalendarEvent = {
  startDate: Date,
  endDate: Date,
  title: string,
  location: string,
  details: string,
}

async function addEventNative({ startDate, endDate, title, location, details }: CalendarEvent) {
  try {
    await Calendar.createEventInteractively(
      title,
      location,
      details,
      startDate,
      endDate
    );
    console.log('Event created successfully.');
  } catch (error) {
    console.error('Failed to create event:', error);
    showToast('Failed to create event', { duration: 5000, isError: true });
  }
}

function addEventWeb({ startDate, endDate, title, location, details }: CalendarEvent) {
  const start = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.download = 'event.ics';
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
}

function addEventToGoogleCalendar({ startDate, endDate, title, location, details }: CalendarEvent) {
  const start = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const url = `https://calendar.google.com/calendar/u/0/r/eventedit?
text=${encodeURIComponent(title)}&
dates=${start}/${end}&
location=${encodeURIComponent(location)}&
details=${encodeURIComponent(details)}`;
  window.open(url, '_blank');
}

type Props = {
  start: string,
  end: string,
  title: string,
  location: string,
  details: string,
}

export default function AddCalendarEventButton({ start, end, title, location, details }: Props) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const calendarEvent = { startDate, endDate, title, location, details };

  if (DEVICE.PLATFORM === DEVICE_TYPE.web) {
    return (
      <>
        <IonSelect
          className='max-w-[152px] bg-blue-600 text-white font-semibold py-2 px-4 rounded'
          aria-label="Add to calendar"
          interface="popover"
          label='Add to calendar'
          value=''
          onIonChange={(e) => {
            const selected = e.detail.value;

            if (selected === 'google') {
              addEventToGoogleCalendar(calendarEvent);
            } else if (selected === 'download') {
              addEventWeb(calendarEvent);
            }
          }}>
          <IonSelectOption value='google'>Google calendar</IonSelectOption>
          <IonSelectOption value='download'>Download ICS</IonSelectOption>
        </IonSelect>
      </>
    )
  }

  return (
    <button
      className="bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      onClick={() => {
        void addEventNative(calendarEvent);
      }}
    >
      Add to calendar
    </button>
  );
}
