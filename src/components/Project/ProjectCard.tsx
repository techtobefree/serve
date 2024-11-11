import { TableRows } from "../../domains/db/tables"
import { useNavigate } from "../../router";

type Props = {
  project: TableRows['project']
}

export default function ProjectCard({ project }: Props) {
  const navigate = useNavigate();

  return (
    <div className="h-32 w-full bg-white rounded-2xl shadow-lg
      overflow-hidden flex justify-center cursor-pointer"
      onClick={() => {
        navigate('/project/:projectId/view', { params: { projectId: project.id } })
      }}>
      <img src={project.image_url ? project.image_url : "https://via.placeholder.com/150"}
        alt="Placeholder"
        className="w-1/3 object-cover" />

      <div className="p-4 flex-1 items-end flex">
        <div className="flex-col h-full flex-1 flex">
          <h2 className="max-w-[150px] text-xl font-semibold text-gray-800
            whitespace-nowrap text-ellipsis">{project.name}</h2>
          <p className="text-gray-600 mt-2 overflow-hidden
            text-ellipsis line-clamp-3">{project.description}</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/project/:projectId/join', { params: { projectId: project.id } })
          }}
        >Join</button>
      </div>
    </div>
  )
}
