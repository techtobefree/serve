import { IonButton } from '@ionic/react';

import { useProjectByIdQuery } from '../../domains/project/queryProjectById';
import useUpsertProjectSurvey from '../../domains/survey/mutationUpsertSurvey';
import { InsertSurveyQuestion, QUESTION_MAP, surveyStore } from '../../domains/survey/survey';

import { showToast } from '../../domains/ui/toast';
import { useNavigate } from '../../router';

import EditSurvey from './EditSurvey';

type Props = {
  project: Exclude<ReturnType<typeof useProjectByIdQuery>['data'], undefined>,
  userId: string
}

function isValidSurvey(survey: InsertSurveyQuestion[] | null) {
  if (!survey) {
    showToast('Survey is empty', { duration: 5000, isError: true });
    return false;
  }

  survey.forEach((question) => {
    if (question.question_text === undefined && question.question_type) {
      question.question_text = QUESTION_MAP[question.question_type].label;
    }
  });

  if (survey.some((question) => !question.question_text)) {
    showToast('Question text is empty', { duration: 5000, isError: true });
    return false;
  }

  return true;
}

const ProjectSurvey = ({ project, userId }: Props) => {
  const navigate = useNavigate();
  const upsertSurvey = useUpsertProjectSurvey({ projectId: project.id }, (error?: Error) => {
    if (!error) {
      navigate('/project/:projectId/view', { params: { projectId: project.id }, replace: true });
    }
  });

  return (
    <div>
      <div>This will be presented to everyone committing to the project.
        The prompt is what you will see in any reports.</div>
      <br />
      <EditSurvey survey={project.survey} />
      <div className='flex justify-end'>
        <IonButton
          color='danger'
          onClick={() => {
            navigate(
              '/project/:projectId/view',
              { params: { projectId: project.id }, replace: true }
            );
          }}>
          Cancel
        </IonButton>
        <IonButton
          onClick={() => {
            if (isValidSurvey(surveyStore.current.questions)) {
              upsertSurvey.mutate({
                surveyId: project.survey?.id,
                projectId: project.id,
                userId,
                questions: surveyStore.current.questions,
              });
            }
          }}>
          Save Survey
        </IonButton>
      </div>
    </div>
  );
};

export default ProjectSurvey;
