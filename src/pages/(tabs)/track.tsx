import { IonButton } from "@ionic/react";
import { observer } from "mobx-react-lite";

import ProjectCard from "../../components/Project/ProjectCard";
import PulsingCard from "../../components/Project/PulsingCard";
import { userStore } from "../../domains/auth/sessionStore";
import { Category, filterSearchToCategories } from "../../domains/search/search";
import { useMyAdminProjectsQuery } from "../../domains/project/queryMyAdminProjects";
import { useMyAttendingProjectsQuery } from "../../domains/project/queryMyAttendingProjects";
import { useModals, useNavigate } from "../../router";

type Props = {
  userId?: string;
}

export function TrackComponent({ userId }: Props) {
  const modals = useModals();
  const navigate = useNavigate();

  const {
    data: adminProjects,
    isLoading: isAdminLoading,
    isError: isAdminError
  } = useMyAdminProjectsQuery(userId);
  const {
    data: attendingProjects,
    isLoading: isAttendingLoading,
    isError: isAttendingError
  } = useMyAttendingProjectsQuery(userId);

  return (
    <>
      {userId && <>
        <div className="text-2xl">{`My Active Projects`}</div>
        <div className="flex justify-center m-1">
          <div className="max-w-[600px] flex-1 flex-col gap-2 flex">
            {isAdminError && <div className='text-3xl p-3'>Error loading projects</div>}
            {isAdminLoading && <>
              <PulsingCard />
            </>}
            {Array.isArray(adminProjects) &&
              adminProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
            {adminProjects?.length === 0 && <div>
              <span>No managed projects.</span>
              <IonButton color="secondary"
                onClick={() => { navigate('/project/new') }}
              >Create one!</IonButton>
            </div>}
            {isAttendingError && <div className='text-3xl p-3'>Error loading projects</div>}
            {isAttendingLoading && <>
              <PulsingCard />
            </>}
            {attendingProjects?.map((project) =>
              <ProjectCard key={project.id} project={project} />)}
            {attendingProjects?.length === 0 && <div>
              <span>No projects joined.</span>
              <IonButton color="secondary"
                onClick={() => {
                  filterSearchToCategories([Category.project])
                  modals.open('/search')
                }}>Find one!</IonButton>
            </div>}
          </div>
        </div>
      </>}
      {/* TODO: Project History */}
      {/* <div className="text-2xl">{`Project History`}</div> */}
      {!userId &&
        <div className="flex flex-col justify-center p-4">
          <div>Login to track projects</div>
          <IonButton color="secondary" onClick={() => {
            modals.open('/profile');
          }}>Login</IonButton>
        </div>}
    </>
  )
}

const Track = observer(() => {
  return (
    <TrackComponent userId={userStore.current?.id} />
  )
})

export default Track;
