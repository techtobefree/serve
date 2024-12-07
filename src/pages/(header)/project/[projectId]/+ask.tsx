import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import Ask from "../../../../components/Event/Ask";
import { useNavigate, useParams } from "../../../../router";

export default function NewEvent() {
  const navigate = useNavigate();
  const { projectId } = useParams('/project/:projectId/view');
  const location = useLocation();
  const { eventId } = location.state || {};
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    // Toggle the overflow-hidden class on the body when modal opens/closes
    document.body.classList.add('overflow-hidden');
    setOpen(true)

    // Clean up the class when the component unmounts
    return () => { document.body.classList.remove('overflow-hidden') };
  }, []);

  return (
    <div className={`fixed inset-0 z-10 flex`}>
      {/* Backdrop */}
      <div
        onClick={() => { navigate(-1) }}
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity opacity-100`}
      ></div>

      {/* Modal Content */}
      <div
        className={`
          pointer-events-none fixed flex justify-center items-end md:items-start pb-4 pt-16
          top-0 left-0 transform transition-transform duration-900 ease-in-out w-full h-full
          ${isOpen ? 'opacity-100' : 'opacity-0'}
          `}
      >
        <Ask projectId={projectId} eventId={eventId} />
      </div>
    </div>
  )
}
