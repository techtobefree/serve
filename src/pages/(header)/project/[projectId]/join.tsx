import { IonButton, IonIcon } from "@ionic/react"
import { arrowBack } from "ionicons/icons"
import { observer } from "mobx-react-lite"
import { useEffect, useRef } from "react"

import { sessionStore } from "../../../../domains/auth/sessionStore"
import { back } from "../../../../domains/ui/back"
import { mayReplace } from "../../../../domains/ui/navigation"
import { useJoinProjectByIdQuery } from "../../../../queries/joinProject"
import { useModals, useNavigate, useParams } from "../../../../router"

type Props = {
  userId?: string
}

export function ProjectJoinPageComponent({ userId }: Props) {
  const { projectId } = useParams('/project/:projectId/join')
  const navigate = useNavigate();
  const { data, isError, isLoading } = useJoinProjectByIdQuery(projectId, userId)
  const modals = useModals();
  const modalOpened = useRef(false);

  useEffect(() => {
    if (!userId && !modalOpened.current) {
      modalOpened.current = true;
      modals.open('/profile')
    }
  }, [userId, modals])

  useEffect(() => {
    if (data) {
      navigate('/project/:projectId/view', { params: { projectId }, replace: mayReplace() })
    }
  }, [data, projectId, navigate])

  return (
    <>
      <div>
        <IonIcon className='cursor-pointer text-4xl'
          icon={arrowBack}
          onClick={() => { back(navigate) }} />
      </div>
      <div className="flex justify-center">
        {userId ?
          <div className="max-w-[800px] w-full">
            {isLoading && <div>Joining project ...</div>}
            {isError && <div>Error joining project</div>}
            {!isError && !isLoading &&
              <div>You should be redirected to view {projectId}</div>
            }
          </div>
          :
          <div>
            You must login to join a project.
          </div>
        }
        <IonButton onClick={() => {
          navigate('/project/:projectId/view', { params: { projectId }, replace: true })
        }}>View project</IonButton>
      </div>
    </>
  )
}

const ProjectJoinPage = observer(() => {
  return (
    <ProjectJoinPageComponent userId={sessionStore.current?.user.id} />
  )
})

export default ProjectJoinPage;
