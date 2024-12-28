import { useEventByIdQuery } from "../project/queryProjectById";

export function getEventAddressAsText(event:
  Exclude<ReturnType<typeof useEventByIdQuery>['data'], undefined>) {
  const parts = [];

  if (event.location_name) {
    parts.push(event.location_name);
  }

  if (event.street_address && event.location_name !== event.street_address) {
    parts.push(event.street_address);
  }

  return `${parts.join(' ')} ${event.city ?
    event.city + ', ' : ''}${[event.state, event.postal_code].filter(Boolean).join(' ')}`;
}
