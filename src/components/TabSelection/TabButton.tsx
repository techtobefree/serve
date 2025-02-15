import { IonIcon } from "@ionic/react";
import { useLocation } from "react-router";

import { mayReplace } from "../../domains/ui/navigation";
import { Path, useNavigate } from "../../router";

function checkIfActive(location: ReturnType<typeof useLocation>, path?: Path) {

  return (
    location.pathname === path || (path === "/home" && location.pathname == "/")
  );
}

type Props = {
  path?: Path;
  icon: string;
  activeIcon: string;
  onClick?: () => void;
};

export default function TabButton({ path, icon, activeIcon, onClick }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = checkIfActive(location, path);

  return (
    <div
      className={`flex flex-1 text-white p-4 cursor-pointer
        ${isActive ? "opacity-100" : "opacity-40"}
        `}
      onClick={
        onClick
          ? onClick
          : () => {
            if (path) {
              void navigate(path, { replace: mayReplace() });
            }
          }
      }
    >
      <IonIcon className="w-full h-full" icon={isActive ? activeIcon : icon} />
    </div>
  );
}
