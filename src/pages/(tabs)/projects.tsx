import ProjectCard from "../../components/Project/ProjectCard";
import PulsingCard from "../../components/Project/PulsingCard";
import { useAllProjectsQuery } from "../../queries/allProjects"

export default function Projects() {
  const { data: projects, isLoading, isError } = useAllProjectsQuery();

  return (
    <div className="h-full flex justify-center m-1">
      <div className="max-w-[600px] flex-1 flex-col gap-2 flex">
        {isError && <div className='text-3xl p-3'>Error loading projects</div>}
        {isLoading && <>
          <PulsingCard />
          <PulsingCard />
          <PulsingCard />
        </>}
        {projects?.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </div>
  )
}
