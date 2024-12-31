import { observer } from "mobx-react-lite";

import { useAllProjectsQuery } from "../../domains/project/queryAllProjects";
import { Category, searchStore } from "../../domains/search/search";
import ProjectCard from "../Project/ProjectCard";
import PulsingCard from "../Project/PulsingCard";

type Props = {
  displayResults: boolean;
}

export function ProjectResultsComponent({ displayResults }: Props) {
  const { data: projects, isLoading, isError } = useAllProjectsQuery();
  if (!displayResults) {
    return null
  }

  return (
    <>
      <div>Projects</div>
      <div className="max-w-[800px] flex-1 flex-col gap-2 flex">
        {isError && <div className='text-3xl p-3'>Error loading projects</div>}
        {isLoading && <>
          <PulsingCard />
          <PulsingCard />
          <PulsingCard />
        </>}
        {projects?.map((project) => <ProjectCard
          key={project.id}
          project={project}
          joinable
        />)}
      </div>
    </>
  )
}

const ProjectResults = observer(() => {
  return <ProjectResultsComponent
    displayResults={!searchStore.categoriesToShow.length ||
      searchStore.categoriesToShow.includes(Category.project)}
  />
})

export default ProjectResults;
