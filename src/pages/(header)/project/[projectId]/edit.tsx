import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";

import ProjectEdit from "../../../../components/Project/ProjectEdit";
import ProjectLoader from "../../../../components/Project/ProjectLoader";
import { mayReplace } from "../../../../domains/ui/navigation";
import { useProjectByIdQuery } from "../../../../domains/project/queryProjectById"
import { useNavigate, useParams } from "../../../../router"
import { userStore } from "../../../../domains/auth/sessionStore";

export default function ProjectEditPage() {
  const { projectId } = useParams('/project/:projectId/view');
  const navigate = useNavigate();
  const { data: project, isLoading, isError } = useProjectByIdQuery(projectId);

  if (!project) {
    return <ProjectLoader projectId={projectId} isLoading={isLoading} isError={isError} />;
  }

  // Careful, this is not updated when mobx store changes
  const userId = userStore.current?.id ? userStore.current.id : undefined;

  return (
    <>
      <div>
        <IonIcon className='cursor-pointer text-4xl'
          icon={arrowBack}
          onClick={() => {
            navigate('/project/:projectId/view', { params: { projectId }, replace: mayReplace() })
          }} />
      </div>
      <div className="flex w-full justify-center">
        <div className="max-w-[800px] w-full">
          <ProjectEdit project={project} userId={userId} />
        </div>
      </div>
    </>
  )
}
