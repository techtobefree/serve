import { IonButton, IonSelect, IonSelectOption } from "@ionic/react";

import {
  addEventNative,
  addEventToGoogleCalendar,
  addEventWeb,
} from "../../domains/date";
import { DEVICE, DEVICE_TYPE } from "../../domains/ui/device";

type Props = {
  start: string;
  end: string;
  title: string;
  location: string;
  details: string;
};

export default function AddCalendarEventButton({
  start,
  end,
  title,
  location,
  details,
}: Props) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const calendarEvent = { startDate, endDate, title, location, details };

  if (DEVICE.PLATFORM === DEVICE_TYPE.web) {
    return (
      <>
        <IonSelect
          className="max-w-[152px] bg-blue-600 text-white font-semibold px-4 rounded"
          aria-label="Add to calendar"
          interface="popover"
          label="Add to calendar"
          value=""
          onIonChange={(e) => {
            const selected = e.detail.value;

            if (selected === "google") {
              addEventToGoogleCalendar(calendarEvent);
            } else if (selected === "download") {
              addEventWeb(calendarEvent);
            }
          }}
        >
          <IonSelectOption value="google">Google calendar</IonSelectOption>
          <IonSelectOption value="download">Download ICS</IonSelectOption>
        </IonSelect>
      </>
    );
  }

  return (
    <IonButton
      color="secondary"
      className="font-semibold py-2 rounded"
      onClick={() => {
        void addEventNative(calendarEvent);
      }}
    >
      Add to calendar
    </IonButton>
  );
}
