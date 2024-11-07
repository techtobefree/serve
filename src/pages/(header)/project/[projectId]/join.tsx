import { IonIcon } from "@ionic/react"
import { arrowBack } from "ionicons/icons"
import { back } from "../../../../domains/ui/back"
import { useNavigate, useParams } from "../../../../router"

export default function ProjectDetail() {
  const { projectId } = useParams('/project/:projectId/join')
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <IonIcon className='cursor-pointer text-4xl' icon={arrowBack} onClick={() => { back(navigate) }} />
      </div>
      Should prompt login, if not logged in, join the project, then reroute to the Detail Page {projectId}
    </div>
  )
}
