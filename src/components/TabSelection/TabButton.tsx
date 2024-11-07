/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonIcon } from "@ionic/react";
import { Path, useNavigate } from "../../router";
import { useLocation } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const checkIfActive = (location: any, path?: Path) => location.pathname === path;

type Props = {
  path?: Path,
  icon: string,
  activeIcon: string,
  onClick?: () => void,
}

export default function TabButton({ path, icon, activeIcon, onClick }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = checkIfActive(location, path)

  return (
    <div
      className={`flex flex-1 ${isActive ? 'text-white' : 'text-blue-500'} p-4 cursor-pointer`}
      onClick={onClick ? onClick : () => { if (path) { navigate(path, { replace: true }) } }}
    >
      <IonIcon className="w-full h-full" icon={isActive ? activeIcon : icon} />
    </div>
  )
}
