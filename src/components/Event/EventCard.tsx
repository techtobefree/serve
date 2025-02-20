import { IonButton, IonIcon } from "@ionic/react";
import { format } from "date-fns";
import { copy } from "ionicons/icons";

import { useState } from "react";

import { getEventAddressAsText } from "../../domains/address";
import { sortDBTimeslots } from "../../domains/date/sort";
import {
  buildTZDateFromDBDayOnly,
  formatDateLLLLddyyyy,
} from "../../domains/date/timezone";
import { IMAGE_SIZE } from "../../domains/image";
import { getPublicUrl, profilePicturePath } from "../../domains/image/image";
import useRemoveCommitment from "../../domains/project/commitment/mutationRemoveCommitment";
import { useProjectCommitmentDownloadQuery } from "../../domains/project/commitment/queryProjectCommitmentReport";
import useRemoveEvent from "../../domains/project/event/mutationRemoveEvent";
import {
  useEventByIdQuery,
  useProjectByIdQuery,
} from "../../domains/project/queryProjectById";
import { useSurveyByIdQuery } from "../../domains/survey/querySurveyById";
import { SURVEY_TYPE } from "../../domains/survey/survey";
import { showToast } from "../../domains/ui/toast";
import { useModals, useNavigate } from "../../router";
import Avatar from "../Avatar";
import AddCalendarEventButton from "../Calendar";

import Timeslot from "./Timeslot";

type Props = {
  currentUserId?: string;
  event: Exclude<ReturnType<typeof useEventByIdQuery>["data"], undefined>;
  commitmentSurvey: ReturnType<typeof useSurveyByIdQuery>["data"] | null;
  attendeeSurvey: ReturnType<typeof useSurveyByIdQuery>["data"] | null;
  project: Exclude<ReturnType<typeof useProjectByIdQuery>["data"], undefined>;
  canEdit: boolean;
};

export default function EventCard({
  currentUserId,
  commitmentSurvey,
  attendeeSurvey,
  event,
  project,
  canEdit,
}: Props) {
  const navigate = useNavigate();
  const modals = useModals();
  const removeCommitment = useRemoveCommitment({ projectId: event.project_id });
  const removeEvent = useRemoveEvent({ projectId: event.project_id });
  // Note: this should probably not be queried every time, but whatever (optimize later)

  const [downloadCommitmentReport, setDownloadCommitmentReport] =
    useState(false);
  useProjectCommitmentDownloadQuery({
    event,
    commitmentSurveyId: commitmentSurvey?.id,
    attendeeSurveyId: attendeeSurvey?.id,
    shouldDownload: downloadCommitmentReport,
    onComplete: () => {
      setDownloadCommitmentReport(false);
    },
    projectEventId: event.id,
  });

  const myCommitments = event.project_event_commitment.filter(
    (i) => i.created_by === currentUserId
  );
  const committed = myCommitments.length > 0;

  return (
    <div className="border border-gray-300 rounded-lg p-4 w-full">
      <div key={event.id} className="flex flex-col">
        {canEdit && (
          <IonButton
            className="whitespace-nowrap"
            color="tertiary"
            onClick={() => {
              setDownloadCommitmentReport(true);
            }}
          >
            Download event report
          </IonButton>
        )}
        <div className="flex justify-between">
          <div className="text-lg">
            {formatDateLLLLddyyyy(
              buildTZDateFromDBDayOnly(event.project_event_date).toDateString()
            )}
          </div>
          {canEdit && (
            <IonButton
              className="whitespace-nowrap"
              color="tertiary"
              onClick={() => {
                removeEvent.mutate({
                  id: event.id,
                  projectId: event.project_id,
                });
              }}
            >
              Delete Event
            </IonButton>
          )}
        </div>
        <div>{event.description}</div>
        <div className="text-lg">
          {(event.location_name || event.street_address) && (
            <div
              className="flex gap-1 cursor-pointer w-fit"
              onClick={() => {
                void navigator.clipboard.writeText(
                  getEventAddressAsText(event)
                );
                showToast("Address copied to clipboard");
              }}
            >
              <div>{event.location_name || event.street_address}</div>
              <div>
                <IonIcon className="text-gray-400" icon={copy} />
              </div>
            </div>
          )}
          <div>
            {event.location_name
              ? event.location_name !== event.street_address
                ? event.street_address
                : ""
              : ""}
          </div>
          <div>
            {`${event.city || "MISSING CITY"}, ${
              event.state || "MISSING STATE"
            } ${event.postal_code || ""}`}
          </div>
        </div>
        {committed && (
          <div>
            {myCommitments.map((commitment) => {
              return (
                <div
                  key={commitment.id}
                  className="flex flex-col gap-2 border-2 p-2 mb-6"
                >
                  <div className="flex justify-between relative">
                    <div className="text-2xl">{`My time`}</div>
                    <div className="absolute right-0">
                      <IonButton
                        disabled={removeCommitment.isPending}
                        color="danger"
                        onClick={() => {
                          removeCommitment.mutate({
                            id: commitment.id,
                            projectId: event.project_id,
                          });
                        }}
                      >
                        X
                      </IonButton>
                    </div>
                  </div>
                  <div>
                    <div>{commitment.role}</div>
                    <div>
                      {format(commitment.commitment_start, "h:mm bbb")}
                      {" - "}
                      {format(commitment.commitment_end, "h:mm bbb")}
                    </div>
                  </div>
                  <div>
                    <AddCalendarEventButton
                      start={commitment.commitment_start}
                      end={commitment.commitment_end}
                      title={project.name}
                      location={getEventAddressAsText(event)}
                      details={project.description || ""}
                    />
                  </div>
                  {/*
                TODO add logic to show the checkin/checkout if commitment demands it (or user asks for it)
                This can be done by linking to the user's profile, along with a query string for the commitment id
                Really, the project leader should be able to go to anyone's profile, and see projects the user
                is committed to, and then checkin/checkout for any projects they are the admin of.
                Having the commitment id in the query string will enable the "non-manual flag" to be set.
                With the commitment id, it should also show a different UI.
                It should check that the commitment id is valid, and is for today.
                EG: big green button for checkin, big red button for checkout (with some indication of the role)
                Otherwise it would list the projects in a table, with the checkin/checkout buttons in the table.
              */}
                  {/* <div>
                Check in
              </div>
              <div>
                Check out
              </div> */}
                </div>
              );
            })}
          </div>
        )}
        <div>
          {event.project_event_timeslot
            .sort(sortDBTimeslots)
            .map((timeslot, index) => (
              <Timeslot
                key={index}
                canEdit={canEdit}
                currentUserId={currentUserId}
                survey={
                  timeslot.survey_type === SURVEY_TYPE.attendee
                    ? attendeeSurvey
                    : commitmentSurvey
                }
                timeslot={timeslot}
                committed={committed}
                event={event}
              />
            ))}
        </div>
        {canEdit && (
          <IonButton
            color="tertiary"
            onClick={() => {
              modals.open("/project/[projectId]/ask", {
                params: { projectId: event.project_id },
                state: {
                  eventId: event.id,
                },
              });
            }}
          >
            Add Timeslot
          </IonButton>
        )}
        {currentUserId && (
          <div className="border-rounded p-2">
            <div className="text-2xl">{`Who`}</div>
            <div>
              {event.project_event_commitment.length === 0 &&
                "No one is going yet"}
              {event.project_event_commitment.map((commitment, index) => {
                return (
                  <div
                    key={commitment.id}
                    className={`flex justify-between items-center gap-2 pl-2 pr-2 -ml-2 -mr-2
                  ${index % 2 === 0 ? "bg-[#ddd]" : ""}`}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        void navigate("/user/:userId/view", {
                          params: { userId: commitment.created_by },
                        });
                      }}
                    >
                      <Avatar
                        size={IMAGE_SIZE.AVATAR_SMALL}
                        alt={commitment.profile.handle || "Volunteer Photo"}
                        src={getPublicUrl(
                          profilePicturePath(commitment.created_by)
                        )}
                      />
                    </div>
                    <div>
                      {
                        (commitment.profile as unknown as { handle: string })
                          .handle
                      }
                    </div>
                    <div>
                      <div>{commitment.role}</div>
                      <div>
                        {format(commitment.commitment_start, "h:mm bbb")}
                        {" - "}
                        {format(commitment.commitment_end, "h:mm bbb")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
