import { useEffect, useState } from "react";

import CreateEvent from "../../../../components/Event/CreateEvent";
import { useQueryLastEventByProjectId } from "../../../../domains/project/event/queryLastEventByProjectId";
import { useNavigate, useParams } from "../../../../router";

export default function NewEvent() {
  const navigate = useNavigate();
  const { projectId } = useParams("/project/:projectId/view");
  const [isOpen, setOpen] = useState(false);

  const { data: lastEvents } = useQueryLastEventByProjectId(projectId);

  useEffect(() => {
    // Toggle the backdrop-no-scroll class on the body when modal opens/closes
    document.body.classList.add("backdrop-no-scroll");
    setOpen(true);

    // Clean up the class when the component unmounts
    return () => {
      document.body.classList.remove("backdrop-no-scroll");
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-10 flex`}>
      {/* Backdrop */}
      <div
        onClick={() => {
          void navigate(-1);
        }}
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity opacity-50`}
      ></div>

      {/* Modal Content */}
      <div
        className={`
          pointer-events-none fixed flex justify-center items-end md:items-start
          top-0 left-0 transform transition-transform duration-900 ease-in-out w-full h-full
          ${isOpen ? "opacity-100" : "opacity-0"}
          `}
      >
        <CreateEvent
          projectId={projectId}
          lastEvent={lastEvents ? lastEvents[0] : undefined}
        />
      </div>
    </div>
  );
}
