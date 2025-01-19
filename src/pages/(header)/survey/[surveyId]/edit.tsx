import { IonButton, IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";

import { useLocation } from "react-router-dom";

import EditSurvey from "../../../../components/Survey/EditSurvey";
import { userStore } from "../../../../domains/auth/sessionStore";
import useUpsertSurvey from "../../../../domains/survey/mutationUpsertSurvey";
import { useSurveyByIdQuery } from "../../../../domains/survey/querySurveyById";
import { InsertSurveyQuestion, SURVEY_TYPE, surveyStore } from "../../../../domains/survey/survey";
import { showToast } from "../../../../domains/ui/toast";
import { useModals, useNavigate, useParams } from "../../../../router"

const SURVEY_TYPE_MESSAGE: {
  [key in keyof typeof SURVEY_TYPE]: string;
} & {
  generic: string;
} = {
  [SURVEY_TYPE.attendee]: `This survey will be presented to everyone attending the project.
  The prompt will be used as column headers in reports.`,
  [SURVEY_TYPE.volunteer]: `This survey be presented to everyone committing to the project.
  The prompt will be used as column headers in reports.`,
  generic: 'This survey will use the prompts as headers whenever generating a report.',
}

function isValidSurvey(survey: InsertSurveyQuestion[] | null) {
  if (!survey) {
    showToast('Survey is empty', { duration: 5000, isError: true });
    return false;
  }

  if (survey.some((question) => !question.question_text)) {
    showToast('Question text is empty', { duration: 5000, isError: true });
    return false;
  }

  return true;
}
export default function SurveyEditPage() {
  const navigate = useNavigate();

  const modals = useModals();
  const { surveyId } = useParams('/survey/:surveyId/edit');
  const location = useLocation();
  const { surveyType }: { surveyType?: keyof typeof SURVEY_TYPE } = location.state || {};
  const { data: survey, isLoading, isError } = useSurveyByIdQuery(surveyId);
  const upsertSurvey = useUpsertSurvey({ surveyId: survey?.id }, (error?: Error) => {
    if (!error) {
      navigate(-1);
    }
  });

  if (isLoading) {
    return (
      <div className="h-64 w-full bg-white rounded-2xl shadow-lg
        overflow-hidden flex justify-center animate-pulse" />
    )
  }

  if (isError || !survey) {
    return (
      <div>Error loading survey</div>
    )
  }

  // Careful, this is not updated when mobx store changes
  const userId = userStore.current?.id ? userStore.current.id : undefined;

  if (!userId) {
    return <>
      <div>
        <IonIcon className='cursor-pointer text-4xl'
          icon={arrowBack} onClick={() => { navigate(-1) }} />
      </div>
      <div>You must login to create projects.</div>
      <IonButton color="secondary" onClick={() => { modals.open('/menu') }}>Login</IonButton>
    </>
  }

  return (
    <>
      <div>
        <IonIcon className='cursor-pointer text-4xl'
          icon={arrowBack}
          onClick={() => {
            navigate(-1)
          }} />
      </div>
      <div className="flex w-full justify-center p-4">
        <div className="max-w-[800px] w-full">
          <div>{SURVEY_TYPE_MESSAGE[surveyType || 'generic'] ?
            SURVEY_TYPE_MESSAGE[surveyType || 'generic'] :
            SURVEY_TYPE_MESSAGE.generic}</div>
          <br />
          <EditSurvey survey={survey} />
          <div className='flex justify-end'>
            <IonButton
              color='danger'
              onClick={() => {
                navigate(-1);
              }}>
              Cancel
            </IonButton>
            <IonButton
              onClick={() => {
                if (isValidSurvey(surveyStore.current.questions)) {
                  upsertSurvey.mutate({
                    surveyId: survey.id,
                    userId,
                    questions: surveyStore.current.questions,
                  });
                }
              }}>
              Save Survey
            </IonButton>
          </div>
        </div>
      </div>
    </>
  )
}
