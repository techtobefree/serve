import { IonButton, IonIcon } from "@ionic/react"
import { createOutline } from "ionicons/icons"

import { IMAGE_SIZE } from "../../domains/image"
import { BASE_URL, mayReplace } from "../../domains/ui/navigation"
import useJoinProject from "../../mutations/joinProject"
import useLeaveProject from "../../mutations/leaveProject"
import { getPublicUrl, projectPicturePath } from "../../queries/image"
import { useProjectByIdQuery } from "../../queries/projectById"
import { useQrCode } from "../../queries/qr"
import { useModals, useNavigate } from "../../router"
import EventCard from "../Event/EventCard"

import ProfileCard from "../Profile/ProfileCard"
import QR from "../QR"

import ProjectImage from "./ProjectImage"

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

      {/* Follow button */}
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

      {/* Edit button */}
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

      {/* Project Image & QR Code */}
      <div className='flex justify-between items-center #container'>
        <div>
          <ProjectImage
            src={project.image_url || getPublicUrl(projectPicturePath(project.id))}
            alt="Project"
            size={IMAGE_SIZE.PROJECT_LARGE}
            className="max-w-[60vw] object-cover" />
        </div>
        <div className='w-1/3'>
          <QR
            src={projectQrCodeUrl}
            alt='QR Code'
            className="max-w-[30vw]"
            size={IMAGE_SIZE.QR} />
        </div>
      </div>

      {/* <div>Members: {project.user_project.length}</div>
      {project.user_project.map(i => {
        return (
          <div key={i.user_id}>
            {i.profile?.handle || i.user_id}
          </div>
        )
      })}
      <br /> */}

      {/* Description & Leader */}
      <div className='flex'>
        <div className='w-2/3'>
          <div className='text-2xl'>Description</div>
          <div>{project.description}</div>
        </div>
        <div className='w-1/3'>
          <div className='text-2xl'>Leader</div>
          <ProfileCard
            size={IMAGE_SIZE.AVATAR_MEDIUM}
            userId={project.lead_by || project.owner_id} />
        </div>
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
      <br />
      {canEdit && (
        <IonButton
          color='tertiary'
          onClick={() => {
            modals.open('/project/[projectId]/event', { params: { projectId: project.id } })
          }}>Create event</IonButton>
      )}
    </div>
  )
}
