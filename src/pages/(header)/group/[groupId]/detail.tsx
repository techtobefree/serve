import { useParams } from "../../../../router"

export default function GroupDetail() {
  const { groupId } = useParams('/group/:groupId/detail')

  return (
    <div>Group Detail Page {groupId}</div>
  )
}
