import { IonButton, IonIcon } from "@ionic/react"
import { createOutline } from "ionicons/icons"

import { BASE_URL, mayReplace } from "../../domains/ui/navigation"
import { useProjectByIdQuery } from "../../queries/projectById"
import { useQrCode } from "../../queries/qr"
import { useNavigate } from "../../router"

type Props = {
  project: ReturnType<typeof useProjectByIdQuery>['data'];
  canEdit: boolean;
}

export default function ProjectView({ project, canEdit }: Props) {
  const navigate = useNavigate();
  const { data: projectQrCodeUrl } =
    useQrCode(`${BASE_URL}/project/${project?.id || ''}/view`, !project?.id)

  if (!project) {
    return
  }

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
      <br />
      <div>{project.description}</div>
      <br />
      <br />
      <div className="w-full flex justify-end">
        <IonButton
          onClick={() => {
            navigate(
              '/project/:projectId/join',
              { params: { projectId: project.id }, replace: true }
            )
          }}>Join Project</IonButton>
      </div>
    </>
  )
}
