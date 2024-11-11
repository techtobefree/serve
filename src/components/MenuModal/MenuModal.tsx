import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { observer } from "mobx-react-lite";

import { useNavigate } from "../../router";

export function MenuModalContentComponent() {
  const navigate = useNavigate();

  return (
    <>
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Menu</h2>

        {/* Close Button */}
        <button
          onClick={() => { navigate(-1) }}
          className="text-gray-400 hover:text-gray-600"
        >
          <IonIcon className="text-4xl text-blue-500" icon={closeOutline} />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 text-gray-700">Other stuff</div>
    </>
  )
}

const MenuModalContent = observer(() => {
  return <MenuModalContentComponent />
});

export default MenuModalContent;
