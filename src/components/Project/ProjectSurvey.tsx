import { useNavigate } from '../../router';
import useUpsertProjectSurvey from '../../domains/survey/mutationUpsertSurvey';
import { useProjectByIdQuery } from '../../domains/project/queryProjectById';
import { IonButton } from '@ionic/react';
import { surveyStore } from '../../domains/survey/survey';
import EditSurvey from '../Survey/EditSurvey';

type Props = {
  project: Exclude<ReturnType<typeof useProjectByIdQuery>['data'], undefined>,
  userId: string
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
      <div>Coming soon!</div>
      <EditSurvey survey={project.survey} />
      <div className='flex justify-end'>
        <IonButton
          onClick={() => {
            upsertSurvey.mutate({
              projectId: project.id,
              userId,
              newQuestions: surveyStore.current.questions,
              questionIdsToClose: surveyStore.current.questionIdsToClose,
            });
          }}>
          Save Survey
        </IonButton>

      </div>
    </div>
  );
};

export default ProjectSurvey;
