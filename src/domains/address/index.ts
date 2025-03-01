// eslint-disable-next-line import/no-nodejs-modules
import { Buffer } from "buffer";

import WKB from "ol/format/WKB";
import Point from "ol/geom/Point";

import { useEventByIdQuery } from "../project/queryProjectById";

export function getEventAddressAsText(
  event: Exclude<ReturnType<typeof useEventByIdQuery>["data"], undefined>
) {
  const parts = [];

  if (event.location_name) {
    parts.push(event.location_name);
  }

  if (event.street_address && event.location_name !== event.street_address) {
    parts.push(event.street_address);
  }

  return `${parts.join(" ")} ${event.city ? event.city + ", " : ""}${[
    event.state,
    event.postal_code,
  ]
    .filter(Boolean)
    .join(" ")}`;
}

export function dbLocationToLatLng(location: string): {
  lat: number;
  lng: number;
} {
  const wkbBuffer = new Uint8Array(Buffer.from(location, "hex"));
  const format = new WKB();
  const geometry = format.readGeometry(wkbBuffer) as Point;
  const [lng, lat] = geometry.getCoordinates();

  return { lat, lng };
}
