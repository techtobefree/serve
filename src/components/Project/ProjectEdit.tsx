import { IonButton, IonIcon } from "@ionic/react"
import { saveOutline } from "ionicons/icons"
import { TableInsert } from "../../domains/db/tables"
import { useNavigate } from "../../router"

type Props = {
  project: TableInsert['project']
}

export default function ProjectEdit({ project }: Props) {
  const navigate = useNavigate();
  const goBack = () => {
    if (project.id) {
      navigate('/project/:projectId/view', { params: { projectId: project.id }, replace: true })
    } else {
      navigate(-1)
    }
  }

  return (
    <div>
      <div className="flex justify-between m-2">
        <div className="text-3xl">{project.name}</div>
      </div>

      <img src={project.image_url ? project.image_url : "https://via.placeholder.com/150"}
        alt="Placeholder"
        className="w-1/3 object-cover" />

      <div>{project.description}</div>

      {/* TODO floating action button */}
      <IonButton>
        <IonIcon className='cursor-pointer text-2xl' icon={saveOutline} onClick={() => { goBack() }} />
      </IonButton>
    </div>
  )
}
