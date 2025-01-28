/* eslint-disable max-len */
import { Timeslot } from "../project/event/mutationCreateTimeslots";

export function sortTimeslots(a: Timeslot, b: Timeslot) {
  // Feel free to make this readable
  return a.hour < b.hour
    ? -1
    : a.hour > b.hour
    ? 1
    : a.minute < b.minute
    ? -1
    : a.minute > b.minute
    ? 1
    : 0;
}

export function sortDBTimeslots(
  a: { timeslot_start_hour: number; timeslot_start_minute: number },
  b: { timeslot_start_hour: number; timeslot_start_minute: number }
) {
  // Feel free to make this readable
  return a.timeslot_start_hour < b.timeslot_start_hour
    ? -1
    : a.timeslot_start_hour > b.timeslot_start_hour
    ? 1
    : a.timeslot_start_minute < b.timeslot_start_minute
    ? -1
    : a.timeslot_start_minute > b.timeslot_start_minute
    ? 1
    : 0;
}
