import { useParams } from "../../../../router"

export default function ProjectDetail() {
  const { projectId } = useParams('/project/:projectId/join')

  return (
    <div>Should prompt login, if not logged in, join the project, then reroute to the Detail Page {projectId}</div>
  )
}
