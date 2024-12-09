import { IonButton, IonIcon } from "@ionic/react";
import { closeOutline, createOutline } from "ionicons/icons";

import { logout } from "../../domains/auth/smsOTP";
import { CurrentUser } from "../../domains/currentUser/currentUserStore";
import { useNavigate } from "../../router";

type Props = {
  currentUser: CurrentUser;
}

export default function LoggedIn({ currentUser }: Props) {
  const navigate = useNavigate();

  const userId = currentUser.userId;

  return (
    <>
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-gray-200 p-4">
        {userId && (
          <div className="flex items-center cursor-pointer"
            onClick={() => {
              navigate('/user/:userId/view', { params: { userId }, replace: true })
            }}>
            <IonIcon icon={createOutline} className='text-xl p-2 text-blue-500' />
            <div className='flex flex-col p-1'>
              <div className="text-xl font-semibold">
                {currentUser.handle}
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
