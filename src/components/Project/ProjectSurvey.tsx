import { TableInsert } from '../../domains/persistence/tables';
import { useNavigate } from '../../router';
import useUpsertSurvey from '../../domains/survey/mutationUpsertSurvey';
import { useProjectByIdQuery } from '../../domains/project/queryProjectById';
import { IonButton } from '@ionic/react';

type Props = {
  project: Exclude<ReturnType<typeof useProjectByIdQuery>['data'], undefined>,
  userId: string
}

const ProjectSurvey = ({ project, userId }: Props) => {
  const navigate = useNavigate();
  const newQuestions: TableInsert['survey_question'][] = [];
  const deleteQuestionIds: string[] = [];
  const upsertSurvey = useUpsertSurvey({ projectId: project.id }, (error?: Error) => {
    if (!error) {
      navigate('/project/:projectId/view', { params: { projectId: project.id }, replace: true });
    }
  });

  return (
    <div>
      <div>Coming soon!</div>
      <IonButton
        onClick={() => {
          upsertSurvey.mutate({
            projectId: project.id,
            userId,
            newQuestions,
            deleteQuestionIds,
          });
        }}>
        Save Survey
      </IonButton>
    </div>
  );
};

export default ProjectSurvey;
