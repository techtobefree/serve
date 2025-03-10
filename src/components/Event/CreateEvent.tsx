import { tzOffset } from "@date-fns/tz";
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from "@ionic/react";
import { format } from "date-fns";
import { closeOutline } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

import { dbLocationToLatLng } from "../../domains/address";
import { blankAddress } from "../../domains/address/addressComponents";
import { userStore } from "../../domains/auth/sessionStore";
import useCreateEvent from "../../domains/project/event/mutationCreateEvent";
import { useQueryLastEventByProjectId } from "../../domains/project/event/queryLastEventByProjectId";
import { showToast } from "../../domains/ui/toast";
import { useNavigate } from "../../router";
import FutureDatePicker from "../Picker/FutureDatePicker";
import LocationPicker from "../Picker/LocationPicker";

type Props = {
  lastEvent?: Exclude<
    ReturnType<typeof useQueryLastEventByProjectId>["data"],
    undefined
  >[number];
  projectId: string;
  userId?: string;
};

const timezones = [
  // UTC-12 to UTC-8
  "Pacific/Wake",
  "Pacific/Honolulu", // UTC-10
  "America/Anchorage", // UTC-9
  "America/Los_Angeles", // UTC-8
  "America/Vancouver",
  "America/Tijuana",

  // UTC-7 to UTC-5
  "America/Phoenix", // UTC-7
  "America/Denver",
  "America/Edmonton",
  "America/Chicago", // UTC-6
  "America/Mexico_City",
  "America/New_York", // UTC-5
  "America/Toronto",
  "America/Bogota",

  // UTC-4 to UTC-2
  "America/Halifax", // UTC-4
  "America/Santiago",
  "America/Caracas",
  "America/St_Johns", // UTC-3:30
  "America/Sao_Paulo", // UTC-3
  "America/Buenos_Aires",

  // UTC-1 to UTC+0
  "Atlantic/Azores", // UTC-1
  "Atlantic/Cape_Verde",
  "UTC", // UTC+0
  "Europe/London",
  "Europe/Dublin",

  // UTC+1 to UTC+3
  "Europe/Paris", // UTC+1
  "Europe/Berlin",
  "Europe/Rome",
  "Africa/Cairo", // UTC+2
  "Europe/Helsinki",
  "Asia/Jerusalem",
  "Europe/Moscow", // UTC+3
  "Asia/Qatar",

  // UTC+4 to UTC+6
  "Asia/Dubai", // UTC+4
  "Asia/Kabul", // UTC+4:30
  "Asia/Karachi", // UTC+5
  "Asia/Kolkata", // UTC+5:30
  "Asia/Kathmandu", // UTC+5:45
  "Asia/Dhaka", // UTC+6
  "Asia/Yangon", // UTC+6:30

  // UTC+7 to UTC+9
  "Asia/Bangkok", // UTC+7
  "Asia/Singapore", // UTC+8
  "Asia/Shanghai",
  "Asia/Taipei",
  "Asia/Tokyo", // UTC+9
  "Asia/Seoul",

  // UTC+10 to UTC+14
  "Australia/Brisbane", // UTC+10
  "Australia/Sydney", // UTC+11 (with DST)
  "Australia/Melbourne",
  "Pacific/Norfolk", // UTC+11
  "Pacific/Auckland", // UTC+12
  "Pacific/Fiji",
  "Pacific/Chatham", // UTC+12:45
  "Pacific/Apia", // UTC+13
  "Pacific/Kiritimati", // UTC+14
];

export function CreateEventComponent({ lastEvent, projectId, userId }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString());
  const [manualDate, setManualDate] = useState("");
  const [manualDateError, setManualDateError] = useState("");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [addressName, setAddressName] = useState("");
  const [address, setAddress] = useState(blankAddress());
  const [timezone, setTimezone] = useState("America/Denver");
  const { mutate, isPending } = useCreateEvent({ projectId }, () => {
    void navigate(-1);
  });

  useEffect(() => {
    if (date) {
      setManualDate(format(date, "MM-dd-yyyy"));
      setManualDateError("");
    }
  }, [date]);

  return (
    <div
      ref={modalRef}
      className="bg-white flex flex-col p-4 mb-6
    max-h-[calc(100vh-96px)] pointer-events-auto overflow-auto"
    >
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-8 justify-between w-full">
          <div className="text-4xl">Create an Event</div>
          {/* Close Button */}
          <IonIcon
            className="text-4xl cursor-pointer"
            icon={closeOutline}
            onClick={() => {
              void navigate(-1);
            }}
          />
        </div>
        {lastEvent && (
          <IonItem className="w-full">
            <IonButton
              color="secondary"
              onClick={() => {
                if (lastEvent.description)
                  setDescription(lastEvent.description);

                setTimezone(lastEvent.timezone);

                if (lastEvent.location_name)
                  setAddressName(lastEvent.location_name);

                if (lastEvent.location) {
                  const lastLocation = dbLocationToLatLng(
                    lastEvent.location as string
                  );
                  setLocation(lastLocation);
                }

                const newAddress = { ...address };
                if (lastEvent.street_address)
                  newAddress.street = lastEvent.street_address;
                if (lastEvent.city) newAddress.city = lastEvent.city;
                if (lastEvent.state) newAddress.state = lastEvent.state;
                if (lastEvent.postal_code)
                  newAddress.postalCode = lastEvent.postal_code;
                if (lastEvent.country) newAddress.country = lastEvent.country;
                setAddress(newAddress);
              }}
            >
              Copy previous event
            </IonButton>
          </IonItem>
        )}
        <IonItem className="w-full">
          <IonTextarea
            label="Description"
            value={description}
            onIonChange={(e) => {
              setDescription(e.target.value || "");
            }}
          />
        </IonItem>
        <IonItem className="w-full">
          <IonSelect
            label="Timezone"
            value={timezone}
            onIonChange={(e) => {
              setTimezone(e.detail.value as string);
            }}
          >
            {timezones.map((tz) => {
              const offset =
                tzOffset(tz, new Date("2020-01-15T00:00:00Z")) / 60;
              const sign = offset >= 0 ? "+" : "";
              return (
                <IonSelectOption key={tz} value={tz}>
                  {tz.replace(/_/g, " ")} (UTC{sign}
                  {offset})
                </IonSelectOption>
              );
            })}
          </IonSelect>
        </IonItem>
        <IonItem className="w-full">
          <IonInput
            label="Date"
            labelPlacement="fixed"
            value={manualDate}
            onIonChange={(e) => {
              setManualDate(e.detail.value || "");
              if (!e.detail.value) {
                return;
              }
              try {
                format(e.detail.value, "MM-dd-yyyy");
                setManualDateError("");
              } catch (err) {
                setManualDateError("Invalid date, please use MM-dd-yyyy");
                console.log("Invalid date", err);
              }
            }}
          />
        </IonItem>
        {manualDateError && (
          <div className="text-red-500">{manualDateError}</div>
        )}
        <div className={manualDateError ? "border-2 border-red-500" : ""}>
          <FutureDatePicker value={date} onChange={setDate} />
        </div>
        <br />
        <LocationPicker
          location={location}
          changeLocation={setLocation}
          addressName={addressName}
          changeAddressName={setAddressName}
          address={address}
          changeAddress={setAddress}
        />
        <br />
        <br />
        <IonButton
          color="secondary"
          disabled={isPending}
          onClick={() => {
            if (manualDateError) {
              modalRef.current?.scrollTo(0, 0);
              return;
            }
            if (!location.lat || !location.lng) {
              showToast("Please select a location", {
                duration: 5000,
                isError: true,
              });
              return;
            }
            if (!userId) {
              showToast("No user id", { duration: 5000, isError: true });
              return;
            }
            mutate({
              projectId,
              userId,
              date: manualDate,
              location,
              addressName,
              address,
              timezone,
              description,
            });
          }}
        >
          Create event
        </IonButton>
      </div>
    </div>
  );
}

const CreateEvent = observer(
  ({ lastEvent, projectId }: Omit<Props, "userId">) => {
    return (
      <CreateEventComponent
        projectId={projectId}
        lastEvent={lastEvent}
        userId={userStore.current?.id}
      />
    );
  }
);

export default CreateEvent;
