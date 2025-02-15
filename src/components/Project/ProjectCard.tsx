import { IonButton } from "@ionic/react";

import { IMAGE_SIZE } from "../../domains/image";
import { getPublicUrl, projectPicturePath } from "../../domains/image/image";
import { TableRows } from "../../domains/persistence/tables";
import { mayReplace } from "../../domains/ui/navigation";
import { useNavigate } from "../../router";

import ProjectImage from "./ProjectImage";

type Props = {
  following?: boolean;
  project: TableRows["project"];
  isOwner?: boolean;
  joinable?: boolean;
};

export default function ProjectCard({
  following,
  project,
  isOwner,
  joinable,
}: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="h-32 w-full bg-white rounded-2xl shadow-md text-black
      overflow-hidden flex justify-center cursor-pointer"
      onClick={() => {
        void navigate("/project/:projectId/view", {
          params: { projectId: project.id },
          replace: mayReplace(),
        });
      }}
    >
      <ProjectImage
        src={project.image_url || getPublicUrl(projectPicturePath(project.id))}
        alt="Project"
        size={IMAGE_SIZE.PROJECT_SMALL}
        className="object-cover"
      />

      <div className="p-4 flex-1 items-end flex">
        <div className="flex-col h-full flex-1 flex">
          <h2
            className="max-w-[150px] text-xl font-semibold
            whitespace-nowrap text-ellipsis"
          >
            {project.name}
          </h2>
          <p
            className="mt-2 overflow-hidden
            text-ellipsis line-clamp-3"
          >
            {project.description}
          </p>
        </div>

        {following && <div>Following</div>}
        {joinable && (
          <IonButton
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              void navigate("/project/:projectId/join", {
                params: { projectId: project.id },
                replace: mayReplace(),
              });
            }}
          >
            Follow
          </IonButton>
        )}
        {isOwner && (
          <IonButton
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              void navigate("/project/:projectId/edit", {
                params: { projectId: project.id },
                replace: mayReplace(),
              });
            }}
          >
            Edit
          </IonButton>
        )}
      </div>
    </div>
  );
}
