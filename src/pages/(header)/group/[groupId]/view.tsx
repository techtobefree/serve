import { useParams } from "../../../../router";

export default function GroupView() {
  const { groupId } = useParams("/group/:groupId/view");

  return <div>Group Page {groupId}</div>;
}
