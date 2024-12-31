import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useModals, useNavigate } from "../router"
import { useSurveyByIdQuery } from "../domains/project/queryProjectById";
import SurveyResponse from "../components/Survey/SurveyResponse";

export default function Survey() {
  const navigate = useNavigate();
  const modals = useModals();
  const location = useLocation();
  const { survey }: { survey: ReturnType<typeof useSurveyByIdQuery>['data'] | null } = location.state || {};


  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    // Toggle the backdrop-no-scroll class on the body when modal opens/closes
    document.body.classList.add('backdrop-no-scroll');
    setOpen(true)

    // Clean up the class when the component unmounts
    return () => { document.body.classList.remove('backdrop-no-scroll') };
  }, []);

  if (!survey) {
    return null;
  }

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
          pointer-events-none fixed flex justify-center md:items-start p-8
          w-full h-full transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full md:-translate-y-full'}
          `}
      >
        <div className='rounded-2xl bg-white flex flex-col gap-4
          pointer-events-auto'>
          <SurveyResponse survey={survey} onComplete={() => modals.close()} />
        </div>
      </div>
    </div>
  )
}
