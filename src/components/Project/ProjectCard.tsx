import { TableRows } from "../../domains/db/tables"
import { hideSearchResults } from "../../domains/search/search";
import { mayReplace } from "../../domains/ui/navigation";
import { useNavigate } from "../../router";

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
          { params: { projectId: project.id }, replace: mayReplace() }
        )
      }}>
      <img src={project.image_url ? project.image_url : "https://via.placeholder.com/150"}
        alt="Placeholder"
        className="w-1/3 object-cover" />

      <div className="p-4 flex-1 items-end flex">
        <div className="flex-col h-full flex-1 flex">
          <h2 className="max-w-[150px] text-xl font-semibold
            whitespace-nowrap text-ellipsis">{project.name}</h2>
          <p className="mt-2 overflow-hidden
            text-ellipsis line-clamp-3">{project.description}</p>
        </div>

        {joinable && (
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              hideSearchResults();
              navigate(
                '/project/:projectId/join',
                { params: { projectId: project.id }, replace: mayReplace() }
              )
            }}
          >Join</button>
        )}

      </div>
    </div>
  )
}
