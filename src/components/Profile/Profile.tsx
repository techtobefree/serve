import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useRef, useState } from "react";

import { formatDateLLLLddyyyy } from "../../domains/date/timezone";
import { IMAGE_SIZE } from "../../domains/image";
import { getPublicUrl, profilePicturePath } from "../../domains/image/image";
import {
  useProfileQuery,
  changeName,
  changeEmail,
  changeHandle,
  changeBio,
  acceptTerms,
  changePhone,
} from "../../domains/profile/queryProfileByUserId";
import { showToast } from "../../domains/ui/toast";
import { Link, useNavigate } from "../../router";
import Avatar from "../Avatar";
import PublicIcon from "../Icon/PublicIcon";
import UploadImage from "../UploadImage";

type Props = {
  canEdit?: boolean;
  userId: string;
  initial?: boolean;
};

export function Profile({ canEdit, userId, initial }: Props) {
  const { data: user, isLoading } = useProfileQuery(userId);
  const acceptedAt = user?.sensitive_profile[0]?.accepted_at;
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    getPublicUrl(profilePicturePath(userId))
  );
  const [tempBase64Image, setTempBase64Image] = useState<string | null>(null);
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const copyNameRef = useRef("");

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  const profile = user.sensitive_profile[0];

  if (canEdit) {
    return (
      <div className="flex w-full justify-center overflow-auto">
        <div className="max-w-[800px] w-full p-2 flex flex-col gap-6">
          {!initial && (
            <div>
              <IonIcon
                className="cursor-pointer text-4xl"
                icon={arrowBack}
                onClick={() => {
                  navigate("/home");
                }}
              />
            </div>
          )}
          {initial && (
            <div className="pb-4">
              {`We require you to fill out your profile to continue.
    Only display name, and reviewing terms and conditions are required.
    Display name, display bio, and your profile picture will be public.
    Once a display name is filled out, you may continue using the site.
    Edit any time by expanding the profile icon in the top right corner.`}
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div className="text-3xl">Personal Profile</div>
            <div className="flex flex-col items-center relative">
              <Avatar
                src={tempBase64Image || profilePicture}
                alt={user.handle}
                size={IMAGE_SIZE.AVATAR_LARGE}
              />
              {!isEditingPhoto && (
                <IonButton
                  color="secondary"
                  className="flex pb-4"
                  onClick={() => {
                    setIsEditingPhoto(true);
                  }}
                >
                  Change picture
                </IonButton>
              )}
              {isEditingPhoto && (
                <UploadImage
                  path={profilePicturePath(userId)}
                  onChange={(image) => {
                    setTempBase64Image(image);
                  }}
                  close={() => {
                    setProfilePicture(
                      `${getPublicUrl(profilePicturePath(userId))}?
                      ${new Date().getTime().toString()}`
                    );
                    setIsEditingPhoto(false);
                  }}
                />
              )}
              <div className="absolute top-0 right-0">
                <PublicIcon />
              </div>
            </div>
            <IonItem>
              <IonInput
                label="First name"
                value={profile.first_name}
                onIonInput={(e) => {
                  copyNameRef.current = `${(e.target.value as string) || ""} ${
                    profile.first_name || ""
                  }`;
                }}
                onIonChange={(e) => {
                  void changeName(userId, { firstName: e.detail.value });
                }}
              />
            </IonItem>
            <IonItem>
              <IonInput
                label="Last name"
                value={profile.last_name}
                onIonInput={(e) => {
                  copyNameRef.current = `${profile.first_name || ""} ${
                    (e.target.value as string) || ""
                  }`;
                }}
                onIonChange={(e) => {
                  void changeName(userId, { lastName: e.detail.value });
                }}
              />
            </IonItem>
            <IonItem>
              <div className="flex flex-col items-center">
                <div>
                  <IonButton
                    color="secondary"
                    className="whitespace-nowrap"
                    onClick={() => {
                      void changeHandle(userId, copyNameRef.current);
                    }}
                  >
                    Copy name
                  </IonButton>
                </div>
                <div>
                  <IonInput
                    label="Display name*"
                    value={user.handle}
                    onIonChange={(e) => {
                      void changeHandle(userId, e.detail.value);
                    }}
                  />
                </div>
              </div>
              <div className="absolute top-0 right-0">
                <PublicIcon />
              </div>
            </IonItem>
            <IonItem>
              <IonLabel className="whitespace-nowrap">Display bio</IonLabel>
              <IonTextarea
                value={user.bio}
                onIonChange={(e) => {
                  void changeBio(userId, e.detail.value);
                }}
                rows={5}
              />
              <div className="absolute top-0 right-0">
                <PublicIcon />
              </div>
            </IonItem>
            <IonItem>
              <IonInput
                label="Email"
                value={profile.email}
                onIonChange={(e) => {
                  void changeEmail(userId, e.detail.value, Boolean(user.email));
                }}
              />
              <div
                className="absolute top-0 right-0 text-blue-500 cursor-pointer"
                onClick={() => {
                  void changeEmail(userId, profile.email, Boolean(!user.email));
                }}
              >
                <PublicIcon off={Boolean(!user.email)} />
              </div>
            </IonItem>
            <IonItem>
              <IonInput
                label="Phone"
                value={profile.phone}
                onIonChange={(e) => {
                  void changePhone(userId, e.detail.value, Boolean(user.phone));
                }}
              />
              <div
                className="absolute top-0 right-0 text-blue-500 cursor-pointer"
                onClick={() => {
                  void changePhone(userId, profile.phone, Boolean(!user.phone));
                }}
              >
                <PublicIcon off={Boolean(!user.phone)} />
              </div>
            </IonItem>
          </div>
          <div className="flex flex-col gap-4 p-2">
            <div className="text-3xl">Terms and conditions</div>
            <div>
              <div className="text-2xl">Community Pledge</div>I pledge to use
              Serve to be Free for good.
            </div>
            <Link className="cursor-pointer text-blue-500" to="/terms">
              Read full terms and conditions
            </Link>
          </div>
          {!acceptedAt && (
            <>
              <IonItem>
                <IonLabel
                  onClick={() => {
                    setAcceptedTerms(!acceptedTerms);
                  }}
                >
                  I accept terms and conditions*
                </IonLabel>
                <IonCheckbox
                  checked={!!acceptedTerms}
                  onIonChange={(e) => {
                    setAcceptedTerms(e.detail.checked);
                  }}
                />
              </IonItem>
              <IonButton
                disabled={!acceptedTerms}
                className="p-4 self-end"
                onClick={() => {
                  void acceptTerms(userId).then(() => {
                    showToast("Thank you for joining us");
                  });
                }}
              >
                Accept
              </IonButton>
            </>
          )}
          {acceptedAt && (
            <>
              <IonItem disabled>
                <IonLabel>I accepted terms and conditions</IonLabel>
                <div>{formatDateLLLLddyyyy(acceptedAt)}</div>
              </IonItem>
              <IonButton
                className="p-4 self-end"
                onClick={() => {
                  navigate("/home");
                }}
              >
                Home
              </IonButton>
            </>
          )}
          <br />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center">
      <div className="max-w-[800px] w-full p-2">
        <div>
          <IonIcon
            className="cursor-pointer text-4xl"
            icon={arrowBack}
            onClick={() => {
              navigate("/home");
            }}
          />
        </div>
        <div>
          <div className="text-3xl">Profile</div>
          <Avatar
            src={tempBase64Image || profilePicture}
            alt={user.handle}
            size={IMAGE_SIZE.AVATAR_LARGE}
          />
          <div>Display name: {user.handle}</div>
        </div>
        {user.bio && (
          <div>
            <div className="text-2xl">Bio</div>
            <div>{user.bio}</div>
          </div>
        )}
        {user.email && (
          <div>
            <div className="text-2xl">Email</div>
            <div>{user.email}</div>
          </div>
        )}
        {user.phone && (
          <div>
            <div className="text-2xl">Phone</div>
            <div>{user.phone}</div>
          </div>
        )}
      </div>
    </div>
  );
}
