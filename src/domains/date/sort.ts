import { Timeslot } from "../../mutations/createTimeslots";

export function sortTimeslots(a: Timeslot, b: Timeslot) {
  // Feel free to make this readable
  return a.hour < b.hour ? -1 : a.hour > b.hour ?
    1 : a.minute < b.minute ? -1 : a.minute > b.minute ? 1 : 0
}

export function sortDBTimeslots(a: any & { timeslot_start_hour: string, timeslot_start_minute: string },
  b: any & { timeslot_start_hour: string, timeslot_start_minute: string }) {
  // Feel free to make this readable
  return a.timeslot_start_hour < b.timeslot_start_hour ? -1 : a.timeslot_start_hour > b.timeslot_start_hour ?
    1 : a.timeslot_start_minute < b.timeslot_start_minute ? -1 : a.timeslot_start_minute > b.timeslot_start_minute ? 1 : 0
}
