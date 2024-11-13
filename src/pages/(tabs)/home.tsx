import { observer } from "mobx-react-lite"

import { sessionStore } from "../../domains/auth/sessionStore";

type Props = {
  userId?: string;
}

export function HomeComponent({ userId }: Props) {
  return (
    <div className='flex justify-center p-10'>
      <div className='max-w-[600px] gap-8'>
        {userId && <div>Welcome {userId} </div>}
        <br />
        <br />
        <div>
          Serve to be Free is committed to helping volunteers find ways to serve,
          and enable community members to start new projects.
        </div>
        <br />
        <br />
        <div>
          We are working on adding progression, and celebrations.
        </div>
        <br />
        <br />
        <div>
          This tab will be the social feed in the future.
        </div>
      </div>
    </div>
  )
}

const Home = observer(() => {
  return (
    <HomeComponent userId={sessionStore.current?.user.id} />
  )
})

export default Home;
