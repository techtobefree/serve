import { useNavigate } from '../../router';
import useUpsertProjectSurvey from '../../domains/survey/mutationUpsertSurvey';
import { useProjectByIdQuery } from '../../domains/project/queryProjectById';
import { IonButton } from '@ionic/react';
import { InsertSurveyQuestion } from '../../domains/survey/survey';

type Props = {
  project: Exclude<ReturnType<typeof useProjectByIdQuery>['data'], undefined>,
  userId: string
}

const ProjectSurvey = ({ project, userId }: Props) => {
  const navigate = useNavigate();
  const newQuestions: InsertSurveyQuestion[] = [];
  const closeQuestionIds: string[] = [];
  const upsertSurvey = useUpsertProjectSurvey({ projectId: project.id }, (error?: Error) => {
    if (!error) {
      navigate('/project/:projectId/view', { params: { projectId: project.id }, replace: true });
    }
  });

  newQuestions.push({
    question_type: 'text',
    question_text: 'What is your favorite color?',
    required: false,
    question_hiding_rules: [],
    question_order: 0,
    question_options: [],
  })

  return (
    <div>
      <div>Coming soon!</div>
      <IonButton
        onClick={() => {
          upsertSurvey.mutate({
            projectId: project.id,
            userId,
            newQuestions,
            closeQuestionIds,
          });
        }}>
        Save Survey
      </IonButton>
    </div>
  );
};

export default ProjectSurvey;
