import { IonButton, IonIcon } from "@ionic/react";
import { add, search } from "ionicons/icons";
import { observer } from "mobx-react-lite";

import ProjectCard from "../../components/Project/ProjectCard";
import PulsingCard from "../../components/Project/PulsingCard";
import { userStore } from "../../domains/auth/sessionStore";
import { useMyAdminProjectsQuery } from "../../domains/project/queryMyAdminProjects";
import { useMyAttendingProjectsQuery } from "../../domains/project/queryMyAttendingProjects";
import { Category, filterSearchToCategories } from "../../domains/search/search";
import { useModals, useNavigate } from "../../router";

type Props = {
  userId?: string;
}

export function HomeComponent({ userId }: Props) {
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
        <div className='flex justify-center'>
          <div className='rounded-2xl bg-white flex flex-col gap-4 p-4
          pointer-events-auto h-fit w-fit'>
            <div className='w-60 border-2 border-black p-2 shadow-lg
          rounded-full flex justify-center items-center relative cursor-pointer'
              onClick={() => {
                filterSearchToCategories([Category.project])
                modals.open('/search')
              }}>
              <IonIcon className='absolute left-2 text-2xl text-[#1a237e]' icon={search} />
              Find a Project
            </div>
            <div className='w-60 border-2 border-black p-2 shadow-lg
          rounded-full flex justify-center items-center relative cursor-pointer'
              onClick={() => {
                navigate('/project/new')
              }}>
              <IonIcon className='absolute left-2 text-2xl text-[#f50057]' icon={add} />
              Create a Project
            </div>
            {/* <div className='w-60 border-2 border-black p-2 shadow-lg
          rounded-full flex justify-center items-center relative cursor-pointer'
              onClick={() => {
                filterSearchToCategories([Category.project])
                modals.open('/search')
              }}>
              <IonIcon className='absolute left-2 text-2xl text-[#1e88e6]' icon={starOutline} />
              Lead a Project
            </div>
            <div className='w-60 border-2 border-black p-2 shadow-lg
          rounded-full flex justify-center items-center relative cursor-pointer'
              onClick={() => {
                filterSearchToCategories([Category.project])
                modals.open('/search')
              }}>
              <IonIcon className='absolute left-2 text-2xl text-[#ffcb1e]' icon={heartOutline} />
              Sponsor a Project
            </div> */}
            <br />
            <div className="flex flex-col justify-center p-4">
              <IonButton color="secondary" onClick={() => {
                modals.open('/menu');
              }}>Login</IonButton>
            </div>
          </div>
        </div>}
    </>
  )
}

const Home = observer(() => {
  return (
    <HomeComponent userId={userStore.current?.id} />
  )
})

export default Home;
