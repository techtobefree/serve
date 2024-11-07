import { IonIcon } from "@ionic/react"
import { createOutline } from "ionicons/icons"
import { TableRows } from "../../domains/db/tables"
import { useNavigate } from "../../router"

type Props = {
  project: TableRows['project'];
  canEdit: boolean;
}

export default function ProjectView({ project, canEdit }: Props) {
  const navigate = useNavigate();

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
      <div>{project.description}</div>
    </>
  )
}
