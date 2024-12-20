import { IonButton, IonIcon } from "@ionic/react";
import { closeOutline, createOutline } from "ionicons/icons";

import { logout } from "../../domains/auth/smsOTP";
import { LoggedInProfile } from "../../domains/profile/loggedInProfileStore";
import { HEADER_HEIGHT } from "../../domains/ui/header";
import { useNavigate } from "../../router";

type Props = {
  currentProfile: LoggedInProfile;
}

export default function LoggedIn({ currentProfile }: Props) {
  const navigate = useNavigate();

  const userId = currentProfile.userId;

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
                {currentProfile.handle}
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
