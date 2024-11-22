import { TZDate } from "@date-fns/tz";
import { formatISO } from "date-fns";

import { TableInsert } from "../db/tables";

export function buildStartTime(
  eventDate: string,
  timezone: string,
  timeslot: TableInsert['project_event_timeslot'],
) {
  const date = new Date(eventDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = timeslot.timeslot_start_hour;
  const minute = timeslot.timeslot_start_minute;

  const datetime = new TZDate(year, month, day, hour, minute, timezone);
  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return datetime.withTimeZone(browserTimeZone);
}

export function tzDateToDB(date: TZDate) {
  return formatISO(date.withTimeZone('UTC'));
}
