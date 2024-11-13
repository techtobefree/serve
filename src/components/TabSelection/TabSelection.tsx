import {
  home,
  homeOutline,
  analytics,
  analyticsOutline,
  map,
  mapOutline,
  add,
  ribbon,
  ribbonOutline,
} from "ionicons/icons";

import { DEVICE, DEVICE_TYPE } from "../../domains/ui/device";
import { mayReplace } from "../../domains/ui/navigation";
import { TAB_SELECTION_HEIGHT } from "../../domains/ui/tabs";
import { useModals, useNavigate } from "../../router";

import TabButton from "./TabButton";

type Props = {
  headerIsVisible: boolean;
}

export default function TabSelection({ headerIsVisible }: Props) {
  const navigate = useNavigate();
  const modals = useModals()

  return (
    <div className={`
      flex h-${TAB_SELECTION_HEIGHT} w-full fixed bottom-0 md:bottom-auto
      ${DEVICE.PLATFORM === DEVICE_TYPE.ios ? 'md:top-16' : 'md:top-0'}
      ${headerIsVisible ? 'md:translate-y-full' : 'md:translate-y-0'}
      left-0 right-0 bg-gray-800 text-white transition-transform duration-300 ease-in-out
      `}>
      <TabButton icon={homeOutline} activeIcon={home} path="/home" />
      <TabButton icon={mapOutline} activeIcon={map} path="/projects" />
      <TabButton icon={add} activeIcon={add} onClick={() => {
        navigate('/projects', { replace: mayReplace() })
        modals.open('/add')
      }} />
      <TabButton icon={analyticsOutline} activeIcon={analytics} path="/track" />
      <TabButton icon={ribbonOutline} activeIcon={ribbon} path="/celebrate" />
    </div>
  )
}
