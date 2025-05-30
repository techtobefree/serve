import { IonButton, IonCheckbox, IonIcon, IonLabel } from "@ionic/react";
import { format } from "date-fns";
import { closeOutline } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { userStore } from "../../domains/auth/sessionStore";
import { IMAGE_SIZE } from "../../domains/image";
import { getPublicUrl, profilePicturePath } from "../../domains/image/image";
import useWitnessCommitments from "../../domains/project/commitment/mutationWitnessCommitment";
import { useQueryProjectCommitments } from "../../domains/project/commitment/queryProjectCommitments";
import { useNavigate } from "../../router";

import Avatar from "../Avatar";

type Props = {
  eventId: string;
  projectId: string;
  userId?: string;
};

export function ReviewCommitmentsComponent({
  eventId,
  projectId,
  userId,
}: Props) {
  const navigate = useNavigate();
  const createTimeslots = useWitnessCommitments(() => {
    void navigate(-1);
  });

  const [witnessData, setWitnessData] = useState<
    {
      userId: string;
      commitmentId: string;
      witness: boolean;
      profileHandle: string;
      commitmentStart: string;
      commitmentEnd: string;
      role: string;
    }[]
  >([]);

  const { data: commitments } = useQueryProjectCommitments(projectId, eventId);

  useEffect(() => {
    if (commitments && commitments.length > 0) {
      const initialWitnessData = commitments.map((commitment) => ({
        commitmentId: commitment.id,
        commitmentStart: commitment.commitment_start,
        commitmentEnd: commitment.commitment_end,
        profileHandle: commitment.profile.handle,
        userId: commitment.created_by,
        role: commitment.role,
        witness: true,
      }));
      setWitnessData(initialWitnessData);
    }
  }, [commitments]);

  if (!userId) {
    return <div>You must login to create events.</div>;
  }

  if (!commitments || commitments.length === 0) {
    return (
      <div className="bg-white p-4 mb-6">
        <div className="text-2xl">No commitments found</div>
      </div>
    );
  }

  return (
    <div
      className="bg-white flex flex-col p-4 mb-6
    max-h-[calc(100vh-96px)] pointer-events-auto overflow-auto "
    >
      <div className="flex flex-col items-center">
        <div>
          <div className="flex items-center mb-8 justify-between w-full">
            <div className="text-4xl">Review commitments</div>
            {/* Close Button */}
            <IonIcon
              className="text-4xl cursor-pointer"
              icon={closeOutline}
              onClick={() => {
                void navigate(-1);
              }}
            />
          </div>
          <div>
            {witnessData.map((commitment, index) => {
              return (
                <div
                  key={commitment.commitmentId}
                  className={`flex justify-between items-center gap-2 pl-2 pr-2 -ml-2 -mr-2
              ${index % 2 === 0 ? "bg-[#ddd]" : ""}`}
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      void navigate("/user/:userId/view", {
                        params: { userId: commitment.userId },
                      });
                    }}
                  >
                    <Avatar
                      size={IMAGE_SIZE.AVATAR_SMALL}
                      alt={commitment.profileHandle}
                      src={getPublicUrl(profilePicturePath(commitment.userId))}
                    />
                  </div>
                  <div>{commitment.profileHandle}</div>
                  <div>
                    <div>{commitment.role}</div>
                    <div>
                      {format(commitment.commitmentStart, "h:mm bbb")}
                      {" - "}
                      {format(commitment.commitmentEnd, "h:mm bbb")}
                    </div>
                  </div>
                  <div>
                    <IonCheckbox
                      onIonChange={(event) => {
                        setWitnessData((prev) =>
                          prev.map((item) =>
                            item.commitmentId === commitment.commitmentId
                              ? {
                                  ...item,
                                  witness: event.detail.checked,
                                }
                              : item
                          )
                        );
                      }}
                      checked={commitment.witness}
                    >
                      <IonLabel>Witness</IonLabel>
                    </IonCheckbox>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 w-full flex justify-end">
            <IonButton
              size="large"
              color="secondary"
              onClick={() => {
                createTimeslots.mutate({
                  projectId,
                  userId,
                  witnessTargets: commitments.map((c) => ({
                    commitmentId: c.id,
                    userId: c.created_by,
                  })),
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

const ReviewCommitments = observer(
  ({ projectId, eventId }: Omit<Props, "userId">) => {
    return (
      <ReviewCommitmentsComponent
        projectId={projectId}
        eventId={eventId}
        userId={userStore.current?.id}
      />
    );
  }
);

export default ReviewCommitments;
