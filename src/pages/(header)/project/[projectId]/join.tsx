import { IonButton, IonIcon } from "@ionic/react"
import { arrowBack } from "ionicons/icons"
import { observer } from "mobx-react-lite"
import { useEffect, useRef } from "react"

import { userStore } from "../../../../domains/auth/sessionStore"
import { mayReplace } from "../../../../domains/ui/navigation"
import { useJoinProjectByIdQuery } from "../../../../domains/project/queryJoinProject"
import { partialQueryKey as projectByIdQueryKey } from "../../../../domains/project/queryProjectById"
import { queryClient } from "../../../../domains/persistence/queryClient"
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
      modals.open('/menu')
    }
  }, [userId, modals])

  useEffect(() => {
    if (data) {
      void queryClient.invalidateQueries({ queryKey: [projectByIdQueryKey, projectId] });
      navigate('/project/:projectId/view', { params: { projectId }, replace: mayReplace() })
    }
  }, [data, projectId, navigate])

  return (
    <>
      <div>
        <IonIcon className='cursor-pointer text-4xl'
          icon={arrowBack}
          onClick={() => { navigate(-1) }} />
      </div>
      <div className="flex justify-center">
        {userId ?
          <div className="max-w-[800px] w-full">
            {isLoading && <div>Following project ...</div>}
            {isError && <div>Error following project</div>}
            {!isError && !isLoading &&
              <div>You should be redirected to view {projectId}</div>
            }
          </div>
          :
          <div>
            You must login to follow a project.
          </div>
        }
        <IonButton
          color="secondary"
          onClick={() => {
            navigate('/project/:projectId/view', { params: { projectId }, replace: true })
          }}>View project</IonButton>
      </div>
    </>
  )
}

const ProjectJoinPage = observer(() => {
  return (
    <ProjectJoinPageComponent userId={userStore.current?.id} />
  )
})

export default ProjectJoinPage;
