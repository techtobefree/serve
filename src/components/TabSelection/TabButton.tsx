/* eslint-disable @typescript-eslint/no-explicit-any */
import { IonButton, IonIcon } from "@ionic/react";
import { useLocation, useNavigate } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const checkIfActive = (location: any, path: string) => location.pathname === path;

type Props = {
  path: string,
  icon: string,
  activeIcon: string,
  onClick?: () => void,
}

export default function TabButton({ path, icon, activeIcon, onClick }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = checkIfActive(location, path)

  return (
    <IonButton
      className={`flex-1 ${isActive ? 'text-blue-500' : 'black'}`}
      onClick={onClick ? onClick : () => { navigate(path, { replace: true }) }}
    >
      <IonIcon icon={isActive ? activeIcon : icon} />
    </IonButton>
  )
}
