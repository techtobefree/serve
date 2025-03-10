import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { observer } from "mobx-react-lite";

import ProjectLoader from "../../../../components/Project/ProjectLoader";
import ProjectView from "../../../../components/Project/ProjectView";
import { userStore } from "../../../../domains/auth/sessionStore";
import { useProjectByIdQuery } from "../../../../domains/project/queryProjectById";
import { useNavigate, useParams } from "../../../../router";

type Props = {
  currentUserId?: string;
};

export function ProjectViewComponent({ currentUserId }: Props) {
  const { projectId } = useParams("/project/:projectId/view");
  const navigate = useNavigate();
  const { data: project, isLoading, isError } = useProjectByIdQuery(projectId);

  if (!project) {
    return (
      <ProjectLoader
        projectId={projectId}
        isLoading={isLoading}
        isError={isError}
      />
    );
  }

  return (
    <>
      <div>
        <IonIcon
          className="cursor-pointer text-4xl"
          icon={arrowBack}
          onClick={() => {
            void navigate("/home");
          }}
        />
      </div>
      <div className="flex justify-center">
        <div className="max-w-[800px] w-full">
          <ProjectView
            project={project}
            currentUserId={currentUserId}
            canEdit={!!currentUserId && project.owner_id === currentUserId}
          />
        </div>
      </div>
    </>
  );
}

const ProjectViewPage = observer(() => {
  return <ProjectViewComponent currentUserId={userStore.current?.id} />;
});

export default ProjectViewPage;
