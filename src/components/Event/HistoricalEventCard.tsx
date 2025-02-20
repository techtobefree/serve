import { format } from "date-fns";

import {
  buildTZDateFromDBDayOnly,
  formatDateLLLLddyyyy,
} from "../../domains/date/timezone";
import { IMAGE_SIZE } from "../../domains/image";
import { getPublicUrl, profilePicturePath } from "../../domains/image/image";
import { useQueryEventsByProjectId } from "../../domains/project/queryEventsByProjectId";
import { useNavigate } from "../../router";
import Avatar from "../Avatar";

type Props = {
  currentUserId?: string;
  event: Exclude<
    ReturnType<typeof useQueryEventsByProjectId>["data"],
    undefined
  >[number];
};

export default function HistoricalEventCard({ currentUserId, event }: Props) {
  const navigate = useNavigate();

  return (
    <div className="border border-gray-300 rounded-lg p-4 w-full">
      <div key={event.id} className="flex flex-col">
        <div>{event.description}</div>
        <div className="text-lg">
          {formatDateLLLLddyyyy(
            buildTZDateFromDBDayOnly(event.project_event_date).toDateString()
          )}
        </div>
        <div className="text-lg">
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
        {currentUserId && (
          <div className="border-rounded p-2">
            <div className="text-2xl">{`Who`}</div>
            <div>
              {event.project_event_commitment.length === 0 && "No one went"}
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
