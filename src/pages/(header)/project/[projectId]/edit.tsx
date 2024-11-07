import { IonButton, IonIcon } from "@ionic/react";
import { useProjectByIdQuery } from "../../../../queries/projectById"
import { useNavigate, useParams } from "../../../../router"
import { arrowBack, saveOutline } from "ionicons/icons";

export default function ProjectDetail() {
  const { projectId } = useParams('/project/:projectId/detail');
  const navigate = useNavigate();
  const { data: project } = useProjectByIdQuery(projectId);

  if (!project) {
    return <div>Cannot find project {projectId}</div>
  }

  return (
    <div>
      <div>
        <IonIcon className='cursor-pointer text-4xl' icon={arrowBack} onClick={() => { navigate('/project/:projectId/detail', { params: { projectId }, replace: true }) }} />
      </div>
      <div className="flex justify-between m-2">
        <div className="text-3xl">{project.name}</div>
      </div>
      <div>{project.description}</div>
      {/* TODO floating action button */}
      <IonButton>
        <IonIcon className='cursor-pointer text-2xl' icon={saveOutline} onClick={() => { navigate('/project/:projectId/detail', { params: { projectId }, replace: true }) }} />
      </IonButton>
    </div>
  )
}
