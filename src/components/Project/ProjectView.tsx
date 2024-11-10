import { IonIcon } from "@ionic/react"
import { createOutline } from "ionicons/icons"
import { useNavigate } from "../../router"
import { useProjectByIdQuery } from "../../queries/projectById"

type Props = {
  project: ReturnType<typeof useProjectByIdQuery>['data'];
  canEdit: boolean;
}

export default function ProjectView({ project, canEdit }: Props) {
  const navigate = useNavigate();

  if (!project) {
    return
  }

  return (
    <>
      <div className="flex justify-between m-2">
        <div className="text-3xl">{project.name}</div>
        {canEdit && <IonIcon className='cursor-pointer text-2xl'
          icon={createOutline}
          onClick={() => { navigate('/project/:projectId/edit', { params: { projectId: project.id }, replace: true }) }} />}
      </div>
      <div>
        <img src={project.image_url ? project.image_url : "https://via.placeholder.com/150"}
          alt="Placeholder"
          className="w-1/3 object-cover" />
      </div>
      <div>Members: {project.user_project.length}</div>
      <div>{project.description}</div>
    </>
  )
}
