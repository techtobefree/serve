import { TableInsert } from '../../domains/db/tables';
import { useNavigate } from '../../router';
import useUpsertSurvey from '../../mutations/upsertSurvey';
import { useProjectByIdQuery } from '../../queries/projectById';
import { IonButton } from '@ionic/react';

type Props = {
  project: Exclude<ReturnType<typeof useProjectByIdQuery>['data'], undefined>,
  userId: string
}

const ProjectSurvey = ({ project, userId }: Props) => {
  const navigate = useNavigate();
  const newQuestions: TableInsert['survey_question'][] = [];
  const deleteQuestionIds: string[] = [];
  const upsertSurvey = useUpsertSurvey({ projectId: project.id });

  return (
    <div>

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
