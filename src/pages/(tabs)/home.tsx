import { IonIcon } from "@ionic/react";
import { add, heartOutline, search, starOutline } from "ionicons/icons";
import { observer } from "mobx-react-lite"

import { sessionStore } from "../../domains/auth/sessionStore";
import { Category, filterSearchToCategories, showSearchResults } from "../../domains/search/search";
import { useProfileQuery } from "../../queries/profileByUserId";
import { useNavigate } from "../../router";

type Props = {
  userId?: string;
}

export function HomeComponent({ userId }: Props) {
  useProfileQuery(userId) // Just to use the userId
  const navigate = useNavigate();

  return (
    <div className='flex justify-center items-center p-10'>
      <div className='max-w-[600px] gap-6 flex flex-col'>
        <div className='w-60 border-2 border-black p-2 shadow-lg
          rounded-full flex justify-center items-center relative cursor-pointer'
          onClick={() => {
            filterSearchToCategories([Category.project])
            showSearchResults()
          }} >
          <IonIcon className='absolute left-2 text-2xl text-[#1a237e]' icon={search} />
          Find a Project
        </div>
        <div className='w-60 border-2 border-black p-2 shadow-lg
          rounded-full flex justify-center items-center relative cursor-pointer'
          onClick={() => {
            navigate('/project/new')
          }} >
          <IonIcon className='absolute left-2 text-2xl text-[#f50057]' icon={add} />
          Create a Project
        </div>
        <div className='w-60 border-2 border-black p-2 shadow-lg
          rounded-full flex justify-center items-center relative cursor-pointer'
          onClick={() => {
            filterSearchToCategories([Category.project])
            showSearchResults()
          }} >
          <IonIcon className='absolute left-2 text-2xl text-[#1e88e6]' icon={starOutline} />
          Lead a Project
        </div>
        <div className='w-60 border-2 border-black p-2 shadow-lg
          rounded-full flex justify-center items-center relative cursor-pointer'
          onClick={() => {
            filterSearchToCategories([Category.project])
            showSearchResults()
          }} >
          <IonIcon className='absolute left-2 text-2xl text-[#ffcb1e]' icon={heartOutline} />
          Sponsor a Project
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
