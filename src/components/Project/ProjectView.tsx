import { IonButton, IonIcon } from "@ionic/react"
import { createOutline } from "ionicons/icons"

import { leaveProject } from "../../commands/leaveProject"
import { BASE_URL, mayReplace } from "../../domains/ui/navigation"
import { useProjectByIdQuery } from "../../queries/projectById"
import { useQrCode } from "../../queries/qr"
import { useNavigate } from "../../router"

type Props = {
  project: ReturnType<typeof useProjectByIdQuery>['data'];
  canEdit: boolean;
  currentUserId?: string;
}

export default function ProjectView({ currentUserId, project, canEdit }: Props) {
  const navigate = useNavigate();
  const { data: projectQrCodeUrl } =
    useQrCode(`${BASE_URL}/project/${project?.id || ''}/view`, !project?.id)

  if (!project) {
    return
  }
  const isUserMember = currentUserId && project.user_project.find(i => i.user_id === currentUserId);

  return (
    <>
      <div className="flex justify-between m-2">
        <div className="text-3xl">{project.name}</div>
        {canEdit && <IonIcon className='cursor-pointer text-2xl'
          icon={createOutline}
          onClick={() => {
            navigate(
              '/project/:projectId/edit',
              { params: { projectId: project.id }, replace: mayReplace() }
            )
          }} />}
      </div>
      <div className='flex justify-between'>
        <img src={project.image_url ? project.image_url : "https://via.placeholder.com/150"}
          alt="Placeholder"
          className="w-1/3 object-cover" />
        <img src={projectQrCodeUrl}
          alt="Placeholder"
          className="w-1/3 object-cover" />
      </div>
      <br />
      <div>Members: {project.user_project.length}</div>
      {project.user_project.map(i => {
        return (
          <div key={i.user_id}>
            {i.profile?.handle || i.user_id}
          </div>
        )
      })}
      <br />
      <div>{project.description}</div>
      <br />
      <br />
      <div className="w-full flex justify-end">
        {!isUserMember && <IonButton
          onClick={() => {
            navigate(
              '/project/:projectId/join',
              { params: { projectId: project.id }, replace: true }
            )
          }}>Join Project</IonButton>}
        {isUserMember && <IonButton
          color='danger'
          onClick={() => {
            void leaveProject(project.id, currentUserId);
          }}>Leave Project</IonButton>}
      </div>
    </>
  )
}
