import { home, people, add, search } from "ionicons/icons";
import { TAB_SELECTION_HEIGHT } from "../../constants/Tabs";
import TabButton from "./TabButton";
import { useNavigate } from "react-router-dom";

type Props = {
  headerIsVisible: boolean;
}

export default function TabSelection({ headerIsVisible }: Props) {
  const navigate = useNavigate();

  return (
    <div className={`flex h-${TAB_SELECTION_HEIGHT} w-full fixed bottom-0 md:bottom-auto md:top-0 ${headerIsVisible ? 'md:translate-y-full' : 'md:translate-y-0'} left-0 right-0 bg-gray-800 text-white transition-transform duration-300 ease-in-out z-10`}>
      <TabButton icon={home} activeIcon={home} path="/" />
      <TabButton icon={people} activeIcon={people} path="/projects" />
      <TabButton icon={add} activeIcon={add} path="" onClick={() => {
        navigate('/projects', { replace: true })
        console.log('Add a project')
      }} />
      <TabButton icon={people} activeIcon={people} path="/groups" />
      <TabButton icon={search} activeIcon={search} path="/messages" />
    </div>
  )
}
