import { useParams } from "../../../../router"

export default function UserView() {
  const { userId } = useParams('/user/:userId/view')

  return (
    <div>User Page {userId}</div>
  )
}
