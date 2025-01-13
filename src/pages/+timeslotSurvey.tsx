import { TZDate } from "@date-fns/tz";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import SurveyResponse from "../components/Survey/SurveyResponse";
import useCommitToTimeslot from "../domains/project/commitment/mutationCommitToTimeslot";
import { useSurveyByIdQuery } from "../domains/survey/querySurveyById";
import { showToast } from "../domains/ui/toast";
import { useModals, useNavigate } from "../router"

export default function TimeslotSurvey() {
  const navigate = useNavigate();
  const modals = useModals();
  const location = useLocation();
  const { survey, timeslotCommitment }:
    {
      survey: ReturnType<typeof useSurveyByIdQuery>['data'] | null,
      timeslotCommitment: {
        projectId: string,
        startTime: TZDate,
        endTime: TZDate,
        eventId: string,
      }
    } = location.state || {};

  const timeslotCommit = useCommitToTimeslot({ projectId: timeslotCommitment.projectId });

  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    // Toggle the backdrop-no-scroll class on the body when modal opens/closes
    document.body.classList.add('backdrop-no-scroll');
    setOpen(true)

    // Clean up the class when the component unmounts
    return () => { document.body.classList.remove('backdrop-no-scroll') };
  }, []);

  if (!survey) {
    showToast('Missing survey', { duration: 5000, isError: true });
    return;
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
          <SurveyResponse
            projectId={timeslotCommitment.projectId}
            survey={survey}
            onCancel={() => {
              modals.close()
            }}
            onComplete={() => {
              timeslotCommit.mutate(timeslotCommitment)
              modals.close()
            }} />
        </div>
      </div>
    </div>
  )
}
