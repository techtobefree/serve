import { IonIcon } from "@ionic/react";
import { useProjectByIdQuery } from "../../../../queries/projectById"
import { useNavigate, useParams } from "../../../../router"
import { arrowBack, createOutline } from "ionicons/icons";
import { back } from "../../../../domains/ui/back";

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
        <IonIcon className='cursor-pointer text-4xl' icon={arrowBack} onClick={() => { back(navigate) }} />
      </div>
      <div className="flex justify-between m-2">
        <div className="text-3xl">{project.name}</div>
        <IonIcon className='cursor-pointer text-2xl' icon={createOutline} onClick={() => { navigate('/project/:projectId/edit', { params: { projectId }, replace: true }) }} />
      </div>
      <div>{project.description}</div>
    </div>
  )
}