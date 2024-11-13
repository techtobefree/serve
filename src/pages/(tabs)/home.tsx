import { observer } from "mobx-react-lite"

import { sessionStore } from "../../domains/auth/sessionStore";

type Props = {
  userId?: string;
}

export function HomeComponent({ userId }: Props) {

  return (
    <>
      {userId && <div>Welcome {userId} </div>}
      <div className="pt-6">To Be Cleaned</div>
    </>
  )
}

const Home = observer(() => {
  return (
    <HomeComponent userId={sessionStore.current?.user.id} />
  )
})

export default Home;
