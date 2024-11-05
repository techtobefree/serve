import { useEffect, useState } from "react";
import { useNavigate } from "../router"
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import ProfileModalContent from "../components/ProfileModalContent/ProfileModalContent";

export default function Profile() {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    // Toggle the overflow-hidden class on the body when modal opens/closes
    document.body.classList.add('overflow-hidden');
    setOpen(true)

    // Clean up the class when the component unmounts
    return () => { document.body.classList.remove('overflow-hidden') };
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex`}>
      {/* Backdrop */}
      <div
        onClick={() => { navigate(-1) }}
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity opacity-100`}
      ></div>

      {/* Modal Content */}
      <div
        className={`fixed overflow-auto left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Close Button */}
        <button
          onClick={() => { navigate(-1) }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <IonIcon className="text-4xl" icon={closeOutline} />
        </button>

        <ProfileModalContent />
      </div>
    </div>
  )
}
