import { IonButton, IonIcon } from "@ionic/react";
import { closeOutline, createOutline } from "ionicons/icons";

import { observer } from "mobx-react-lite";

import { userStore } from "../../domains/auth/sessionStore";
import { logout } from "../../domains/auth/smsOTP";
import { useProfileQuery } from "../../domains/profile/queryProfileByUserId";
import { HEADER_HEIGHT } from "../../domains/ui/header";
import { useNavigate } from "../../router";

import LoggedOut from "./LoggedOut";

type Props = { userId?: string }

export function ProfileMenuComponent({ userId }: Props) {
  const { data: profile } = useProfileQuery(userId);
  const navigate = useNavigate();

  if (!userId || !profile) {
    return <LoggedOut />;
  }

  return (
    <>
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-gray-200 p-4">
        {userId && (
          <div className={`flex items-center cursor-pointer pt-[${HEADER_HEIGHT}px]`}
            onClick={() => {
              navigate('/user/:userId/view', { params: { userId }, replace: true })
            }}>
            <IonIcon icon={createOutline} className='text-4xl p-2 text-blue-500' />
            <div className='flex flex-col p-1'>
              <div className="text-xl font-semibold">
                {profile.handle}
              </div>
              <div>
                Edit Profile
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={() => { navigate(-1) }}
        >
          <IonIcon className="text-4xl" icon={closeOutline} />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-4">
        <div>
          Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
        <br />
        <IonButton color="secondary" onClick={() => { void logout() }}>Logout</IonButton>
      </div>
    </>
  )
}

const ProfileMenu = observer(() => {
  return <ProfileMenuComponent userId={userStore.current?.id} />
})

export default ProfileMenu;
