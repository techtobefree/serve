import { IonButton, IonIcon, IonInput, IonItem } from "@ionic/react";
import { addCircle, closeOutline } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { useState } from "react";

import { userStore } from "../../domains/auth/sessionStore";
import { sortTimeslots } from "../../domains/date/sort";
import useCreateTimeslots, {
  Timeslot,
} from "../../domains/project/event/mutationCreateTimeslots";
import { SURVEY_TYPE } from "../../domains/survey/survey";
import { showToast } from "../../domains/ui/toast";
import { useNavigate } from "../../router";

import TimeslotAsk from "./TimeslotAsk";

type Props = {
  eventId: string;
  projectId: string;
  userId?: string;
};

const buttons = [
  { value: 10, label: "10 Minutes" },
  { value: 30, label: "30 Minutes" },
  { value: 60, label: "1 Hour" },
  { value: 120, label: "2 Hours" },
  { value: 480, label: "8 Hours" },
  { value: 1440, label: "24 Hours" },
];

function nextTimeBlock(
  duration: number,
  hour?: number,
  minute?: number,
  count?: number,
  minimumCount?: number,
  role?: string,
  surveyType?: keyof typeof SURVEY_TYPE,
  checkin: boolean = false,
  checkout: boolean = false
): Timeslot {
  if (hour === undefined || minute === undefined) {
    return {
      checkin,
      checkout,
      duration,
      hour: 18,
      minute: 0,
      count: 0,
      minimumCount: 0,
      role: role || "Volunteer",
      surveyType: surveyType || SURVEY_TYPE.volunteer,
    };
  }

  const nextMinute = minute + duration;
  const nextHour = hour + Math.floor(nextMinute / 60);
  return {
    checkin,
    checkout,
    duration,
    hour: nextHour % 24,
    minute: nextMinute % 60,
    count: count || 0,
    minimumCount: minimumCount || 0,
    role: role || "Volunteer",
    surveyType: surveyType || SURVEY_TYPE.volunteer,
  };
}

export function TimeslotsAskComponent({ eventId, projectId, userId }: Props) {
  const [activeValue, setActiveValue] = useState<number>(60); // Default active value
  const navigate = useNavigate();
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const createTimeslots = useCreateTimeslots({ projectId }, () => {
    navigate(-1);
  });

  if (!userId) {
    return <div>You must login to create events.</div>;
  }

  return (
    <div
      className="bg-white flex flex-col p-4 mb-6
    max-h-[calc(100vh-96px)] pointer-events-auto overflow-auto "
    >
      <div className="flex flex-col items-center">
        <div>
          <div className="flex items-center mb-8 justify-between w-full">
            <div className="text-4xl">Add timeslots</div>
            {/* Close Button */}
            <IonIcon
              className="text-4xl cursor-pointer"
              icon={closeOutline}
              onClick={() => {
                navigate(-1);
              }}
            />
          </div>
          <IonItem style={{ marginLeft: "-16px" }}>
            <IonInput
              label="Duration"
              value={activeValue.toString()}
              onIonChange={(e) => {
                const newValue = e.detail.value;
                try {
                  const newInt = parseInt(newValue as string);
                  if (newInt < 0 || isNaN(newInt)) {
                    throw new Error("Please enter a positive number.");
                  }
                  setActiveValue(newInt);
                } catch (e) {
                  showToast("Please enter a valid number", {
                    duration: 5000,
                    isError: true,
                  });
                  console.log("Error parsing int", e);
                  setActiveValue(60);
                }
              }}
            />
          </IonItem>
          {/* <IonButtons> */}
          <div className="flex flex-wrap max-w-[650px] justify-between max-h-[40vh] overflow-auto">
            {buttons.map((button) => (
              <IonButton
                key={button.value}
                className="w-40"
                onClick={() => {
                  setActiveValue(button.value);
                }}
                color={activeValue === button.value ? "secondary" : "medium"} // Highlight active button
              >
                {button.label}
              </IonButton>
            ))}
          </div>
          <br />
          <div className="w-full flex justify-center">
            <IonIcon
              className="cursor-pointer p-4 self-center"
              icon={addCircle}
              size="large"
              color="secondary"
              onClick={() => {
                const last = timeslots[timeslots.length - 1] || {};
                const newTimeslot = nextTimeBlock(
                  activeValue,
                  last.hour,
                  last.minute,
                  last.count,
                  last.minimumCount,
                  last.role
                );
                setTimeslots([...timeslots, newTimeslot]);
              }}
            />
          </div>
          <br />
          {!timeslots.length && (
            <div className="w-full text-center">No timeslots</div>
          )}
          <div className="flex flex-col gap-2">
            {timeslots.sort(sortTimeslots).map((timeslot, index) => {
              const hourString = timeslot.hour.toString();
              const minuteString = timeslot.hour.toString();
              const id = `${index.toString()}${hourString}${minuteString}`;
              return (
                <TimeslotAsk
                  key={id}
                  timeslot={timeslot}
                  index={index}
                  timeslots={timeslots}
                  setTimeslots={setTimeslots}
                />
              );
            })}
          </div>
          <div className="mt-8 w-full flex justify-end">
            <IonButton
              size="large"
              color="secondary"
              onClick={() => {
                if (timeslots.length === 0) {
                  showToast("Please add at least one timeslot", {
                    duration: 5000,
                    isError: true,
                  });
                  return;
                }
                if (timeslots.some((i) => i.duration <= 0)) {
                  showToast("Please ensure timeslots end after they start", {
                    duration: 5000,
                    isError: true,
                  });
                  return;
                }
                createTimeslots.mutate({
                  eventId,
                  projectId,
                  timeslots,
                  userId,
                });
              }}
              disabled={createTimeslots.isPending}
            >
              Save
            </IonButton>
          </div>
        </div>
      </div>
    </div>
  );
}

const TimeslotsAsk = observer(
  ({ projectId, eventId }: Omit<Props, "userId">) => {
    return (
      <TimeslotsAskComponent
        projectId={projectId}
        eventId={eventId}
        userId={userStore.current?.id}
      />
    );
  }
);

export default TimeslotsAsk;
