import { IonButton } from "@ionic/react";
import { observer } from "mobx-react-lite"

import ProjectCard from "../../components/Project/ProjectCard";
import PulsingCard from "../../components/Project/PulsingCard";
import { sessionStore } from "../../domains/auth/sessionStore";
import { mayReplace } from "../../domains/ui/navigation";
import { useMyAdminProjectsQuery } from "../../queries/myAdminProjects";
import { useMyAttendingProjectsQuery } from "../../queries/myAttendingProjects";
import { useNavigate } from "../../router";

type Props = {
  userId?: string;
}

export function HomeComponent({ userId }: Props) {
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
  const navigate = useNavigate();

  return (
    <>
      {userId && <>
        <div className="text-2xl">{`Admin`}</div>
        <div className="flex justify-center m-1">
          <div className="max-w-[600px] flex-1 flex-col gap-2 flex">
            {isAdminError && <div className='text-3xl p-3'>Error loading projects</div>}
            {isAdminLoading && <>
              <PulsingCard />
            </>}
            {adminProjects?.map((project) => <ProjectCard key={project.id} project={project} />)}
            {adminProjects?.length === 0 && <div>
              <span>No managed projects.</span>
              <IonButton onClick={() => { navigate('/project/new') }}>Create one!</IonButton>
            </div>}
          </div>
        </div>
        <div className="text-2xl">{`Joined`}</div>
        <div className="flex justify-center m-1">
          <div className="max-w-[600px] flex-1 flex-col gap-2 flex">
            {isAttendingError && <div className='text-3xl p-3'>Error loading projects</div>}
            {isAttendingLoading && <>
              <PulsingCard />
            </>}
            {attendingProjects?.map((project) =>
              <ProjectCard key={project.id} project={project} />)}
            {attendingProjects?.length === 0 && <div>
              <span>No projects joined.</span>
              <IonButton onClick={() => {
                navigate('/projects', { replace: mayReplace() })
              }}>Find one!</IonButton>
            </div>}
          </div>
        </div>
      </>}
      <div className="pt-6">To Be Cleaned</div>
    </>
  )
}

const Home = observer(() => {
  return (
    <HomeComponent userId={sessionStore.current?.user.id} />
  )
})

export default Home;
