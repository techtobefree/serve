import { useParams } from "../../../../router"

export default function UserDetail() {
  const { userId } = useParams('/user/:userId/detail')

  return (
    <div>User Detail Page {userId}</div>
  )
}
