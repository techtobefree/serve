import { IonButton, IonIcon } from "@ionic/react"
import { createOutline } from "ionicons/icons"

import { BASE_URL, mayReplace } from "../../domains/ui/navigation"
import useJoinProject from "../../mutations/joinProject"
import useLeaveProject from "../../mutations/leaveProject"
import { useProjectByIdQuery } from "../../queries/projectById"
import { useQrCode } from "../../queries/qr"
import { useModals, useNavigate } from "../../router"
import EventCard from "../Event/EventCard"

type Props = {
  project: Exclude<ReturnType<typeof useProjectByIdQuery>['data'], undefined>;
  canEdit: boolean;
  currentUserId?: string;
}

export default function ProjectView({ currentUserId, project, canEdit }: Props) {
  const navigate = useNavigate();
  const leaveProject = useLeaveProject({ projectId: project.id || '' });
  const joinProject = useJoinProject({ projectId: project.id || '' });
  const modals = useModals();
  const { data: projectQrCodeUrl } =
    useQrCode(`${BASE_URL}/project/${project.id || ''}/view`, !project.id);

  const isUserMember = currentUserId && project.user_project.find(i => i.user_id === currentUserId);

  return (
    <div className='p-2'>
      <div className='absolute top-16 right-2'>
        {!isUserMember && <IonButton
          color='secondary'
          disabled={joinProject.isPending}
          onClick={() => {
            if (currentUserId) {
              joinProject.mutate({ projectId: project.id, userId: currentUserId });
            } else {
              navigate(
                '/project/:projectId/join',
                { params: { projectId: project.id }, replace: true }
              )
            }
          }}>Follow</IonButton>}
        {isUserMember && <IonButton
          color='danger'
          disabled={leaveProject.isPending}
          onClick={() => {
            leaveProject.mutate({ projectId: project.id, userId: currentUserId });
          }}>Unfollow</IonButton>}
      </div>
      <div className="flex justify-between items-center m-2">
        <div className='flex items-center gap-2'>
          {canEdit && <IonButton
            color='tertiary'
            onClick={() => {
              navigate(
                '/project/:projectId/edit',
                { params: { projectId: project.id }, replace: mayReplace() }
              )
            }} >
            <IonIcon icon={createOutline} />
          </IonButton>}
          <div className="text-3xl">{project.name}</div>
        </div>
      </div>
      <div className='flex justify-between'>
        <img src={project.image_url ? project.image_url : "https://via.placeholder.com/150"}
          alt="Placeholder"
          className="w-1/3 object-cover" />
        <img src={projectQrCodeUrl}
          alt="Placeholder"
          className="w-1/3 object-cover" />
      </div>
      <div className='text-2xl'>When & Where</div>
      {!project.project_event.length && (
        <div>No events</div>
      )}
      <div className='flex flex-wrap'>
        {project.project_event
          .sort((a, b) => a.project_event_date < b.project_event_date ? -1 : 1)
          .map(event => {
            return <EventCard key={event.id}
              event={event}
              currentUserId={currentUserId}
              canEdit={canEdit} />
          })}
      </div>
      {canEdit && (
        <IonButton
          color='tertiary'
          onClick={() => {
            modals.open('/project/[projectId]/event', { params: { projectId: project.id } })
          }}>Creat event</IonButton>
      )}
      <br />
      {/* <div>Members: {project.user_project.length}</div>
      {project.user_project.map(i => {
        return (
          <div key={i.user_id}>
            {i.profile?.handle || i.user_id}
          </div>
        )
      })}
      <br /> */}
      <div>{project.description}</div>
      <br />
      <br />
    </div>
  )
}
