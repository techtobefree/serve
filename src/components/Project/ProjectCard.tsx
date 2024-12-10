import { IonButton } from "@ionic/react";

import { TableRows } from "../../domains/db/tables"
import { IMAGE_SIZE } from "../../domains/image";
import { hideSearchResults } from "../../domains/search/search";
import { getPublicUrl, projectPicturePath } from "../../queries/image";
import { useNavigate } from "../../router";

import ProjectImage from "./ProjectImage";

type Props = {
  project: TableRows['project'];
  joinable?: boolean;
}

export default function ProjectCard({ project, joinable }: Props) {
  const navigate = useNavigate();

  return (
    <div className="h-32 w-full bg-white rounded-2xl shadow-md text-black
      overflow-hidden flex justify-center cursor-pointer"
      onClick={() => {
        hideSearchResults();
        navigate(
          '/project/:projectId/view',
          { params: { projectId: project.id } }
        )
      }}>
      <ProjectImage
        src={project.image_url || getPublicUrl(projectPicturePath(project.id))}
        alt="Project"
        size={IMAGE_SIZE.PROJECT_SMALL}
        className="object-cover" />

      <div className="p-4 flex-1 items-end flex">
        <div className="flex-col h-full flex-1 flex">
          <h2 className="max-w-[150px] text-xl font-semibold
            whitespace-nowrap text-ellipsis">{project.name}</h2>
          <p className="mt-2 overflow-hidden
            text-ellipsis line-clamp-3">{project.description}</p>
        </div>

        {joinable && (
          <IonButton
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              hideSearchResults();
              navigate(
                '/project/:projectId/join',
                { params: { projectId: project.id } }
              )
            }}
          >Join</IonButton>
        )}
      </div>
    </div>
  )
}
