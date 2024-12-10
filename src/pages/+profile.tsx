import { useEffect, useState } from "react";

import ProfileModalContent from "../components/ProfileModalContent/ProfileModalContent";
import { useNavigate } from "../router"

export default function Profile() {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    // Toggle the backdrop-no-scroll class on the body when modal opens/closes
    document.body.classList.add('backdrop-no-scroll');
    setOpen(true)

    // Clean up the class when the component unmounts
    return () => { document.body.classList.remove('backdrop-no-scroll') };
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
        className={`
          fixed overflow-auto left-0 top-0 h-full w-80 bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
      >
        <ProfileModalContent />
      </div>
    </div>
  )
}
