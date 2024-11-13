import { IonIcon } from "@ionic/react";
import { arrowBack, closeOutline } from "ionicons/icons";
import { observer } from "mobx-react-lite";

import { useNavigate } from "../../router";

export function MessagesModalContentComponent() {
  const navigate = useNavigate();

  return (
    <>
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-gray-200 p-4">
        <div>
          <IonIcon className='cursor-pointer text-4xl'
            icon={arrowBack}
            onClick={() => { navigate(-1) }} />
        </div>
        <h2 className="text-lg font-semibold">Messages</h2>

        {/* Close Button */}
        <button
          onClick={() => { navigate(-1) }}
          className="text-gray-400 hover:text-gray-600"
        >
          <IonIcon className="text-4xl text-blue-500" icon={closeOutline} />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 text-gray-700">Coming soon...</div>
      <div className="p-6 text-gray-700">Direct messages</div>
      <div className="p-6 text-gray-700">Group messages</div>
      <div className="p-6 text-gray-700">Project messages</div>
    </>
  )
}

const MessagesModalContent = observer(() => {
  return <MessagesModalContentComponent />
});

export default MessagesModalContent;