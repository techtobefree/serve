import { TZDate } from "@date-fns/tz";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import SurveyResponse from "../components/Survey/SurveyResponse";
import useCommitToTimeslot from "../domains/project/commitment/mutationCommitToTimeslot";
import { useSurveyByIdQuery } from "../domains/survey/querySurveyById";
import { showToast } from "../domains/ui/toast";
import { useNavigate } from "../router";

export default function AnswerSurvey() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    surveyId,
    timeslotCommitment,
  }: {
    surveyId: string;
    timeslotCommitment: {
      projectId: string;
      startTime: TZDate;
      endTime: TZDate;
      eventId: string;
      role: string;
      timeslotId: string;
    };
  } = location.state || {};
  const { data: survey, isLoading } = useSurveyByIdQuery(surveyId);

  const timeslotCommit = useCommitToTimeslot(
    { projectId: timeslotCommitment.projectId },
    () => {
      void navigate(-1);
    }
  );
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    // Toggle the backdrop-no-scroll class on the body when modal opens/closes
    document.body.classList.add("backdrop-no-scroll");
    setOpen(true);

    // Clean up the class when the component unmounts
    return () => {
      document.body.classList.remove("backdrop-no-scroll");
    };
  }, []);

  if (isLoading) {
    return (
      <div
        className="h-64 w-full bg-white rounded-2xl shadow-lg
        overflow-hidden flex justify-center animate-pulse"
      />
    );
  }

  if (!survey) {
    showToast("Missing survey", { duration: 5000, isError: true });
    return;
  }

  if (timeslotCommit.isPending) {
    return (
      <div
        className="h-64 w-full bg-white rounded-2xl shadow-lg
        overflow-hidden flex justify-center animate-pulse"
      />
    );
  }

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
          pointer-events-none fixed flex justify-center md:items-start pt-8 pb-8
          w-full h-full transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-y-0" : "translate-y-full md:-translate-y-full"}
          `}
      >
        <div
          className="w-full h-full max-w-[600px]
          rounded-2xl bg-white flex flex-col gap-4 pointer-events-auto"
        >
          <SurveyResponse
            projectId={timeslotCommitment.projectId}
            survey={survey}
            onCancel={() => {
              void navigate(-1);
            }}
            onComplete={() => {
              timeslotCommit.mutate(timeslotCommitment);
            }}
          />
        </div>
      </div>
    </div>
  );
}
