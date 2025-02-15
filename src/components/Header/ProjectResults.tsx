import { observer } from "mobx-react-lite";

import { userStore } from "../../domains/auth/sessionStore";
import { useAllProjectsQuery } from "../../domains/project/queryAllProjects";
// import { useMyJoinedProjectsQuery } from "../../domains/project/queryJoinedProjects";
import { Category, searchStore } from "../../domains/search/search";
import ProjectCard from "../Project/ProjectCard";
import PulsingCard from "../Project/PulsingCard";

type Props = {
  currentUserId?: string;
  displayResults: boolean;
};

export function ProjectResultsComponent({
  // currentUserId,
  displayResults,
}: Props) {
  const { data: projects, isLoading, isError } = useAllProjectsQuery();
  // const { data: joinedProjectMap = {} } =
  //   useMyJoinedProjectsQuery(currentUserId);

  if (!displayResults) {
    return null;
  }

  return (
    <>
      <div>Projects</div>
      <div className="max-w-[800px] flex-1 flex-col gap-2 flex">
        {isError && <div className="text-3xl p-3">Error loading projects</div>}
        {isLoading && (
          <>
            <PulsingCard />
            <PulsingCard />
            <PulsingCard />
          </>
        )}
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          // joinable={!joinedProjectMap[project.id]}
          // following={joinedProjectMap[project.id]}
          />
        ))}
      </div>
    </>
  );
}

const ProjectResults = observer(() => {
  return (
    <ProjectResultsComponent
      displayResults={
        !searchStore.categoriesToShow.length ||
        searchStore.categoriesToShow.includes(Category.project)
      }
      currentUserId={userStore.current?.id}
    />
  );
});

export default ProjectResults;
