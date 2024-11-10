import { IonIcon } from "@ionic/react";
import { useProjectByIdQuery } from "../../../../queries/projectById"
import { useNavigate, useParams } from "../../../../router"
import { arrowBack } from "ionicons/icons";
import { back } from "../../../../domains/ui/back";
import ProjectLoader from "../../../../components/Project/ProjectLoader";
import ProjectView from "../../../../components/Project/ProjectView";
import { observer } from "mobx-react-lite";
import { sessionStore } from "../../../../domains/auth/sessionStore";

type Props = {
  currentUserId?: string;
}

export function ProjectViewComponent({ currentUserId }: Props) {
  const { projectId } = useParams('/project/:projectId/view');
  const navigate = useNavigate();
  const { data: project, isLoading, isError } = useProjectByIdQuery(projectId);

  if (!project) {
    return <ProjectLoader projectId={projectId} isLoading={isLoading} isError={isError} />;
  }

  return (
    <>
      <div>
        <IonIcon className='cursor-pointer text-4xl' icon={arrowBack} onClick={() => { back(navigate) }} />
      </div>
      <div className="flex justify-center">
        <div className="max-w-[800px] w-full">
          <ProjectView project={project} canEdit={!!currentUserId && project.admin_id === currentUserId} />
        </div>
      </div>
    </>
  )
}

const ProjectViewPage = observer(() => {
  return <ProjectViewComponent currentUserId={sessionStore.current?.user.id} />
})

export default ProjectViewPage;