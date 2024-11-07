import { IonButton, IonIcon } from "@ionic/react";
import { logout } from "../../domains/auth/smsOTP";
import { closeOutline, createOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";

type Props = {
  handle: string
}

export default function LoggedIn({ handle }: Props) {
  const navigate = useNavigate();

  return (
    <>
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-gray-200 p-4">
        <div className="flex items-center cursor-pointer">
          <IonIcon icon={createOutline} className='text-xl p-1 text-blue-500' />
          <h2 className="text-lg font-semibold">
            {handle}
          </h2>
        </div>

        {/* Close Button */}
        <button
          onClick={() => { navigate(-1) }}
          className="text-gray-400 hover:text-gray-600"
        >
          <IonIcon className="text-4xl text-blue-500" icon={closeOutline} />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-4">
        <IonButton onClick={() => { void logout() }}>Logout</IonButton>
      </div>
    </>
  )
}
