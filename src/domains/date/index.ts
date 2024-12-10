import { Calendar } from "@awesome-cordova-plugins/calendar";

import { showToast } from "../ui/toast";

export type CalendarEvent = {
  startDate: Date,
  endDate: Date,
  title: string,
  location: string,
  details: string,
}

export async function addEventNative({
  startDate,
  endDate,
  title,
  location,
  details
}: CalendarEvent) {
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

export function addEventWeb({
  startDate,
  endDate,
  title,
  location,
  details
}: CalendarEvent) {
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

export function addEventToGoogleCalendar({
  startDate,
  endDate,
  title,
  location,
  details
}: CalendarEvent) {
  const start = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const url = `https://calendar.google.com/calendar/u/0/r/eventedit?
text=${encodeURIComponent(title)}&
dates=${start}/${end}&
location=${encodeURIComponent(location)}&
details=${encodeURIComponent(details)}`;
  window.open(url, '_blank');
}
