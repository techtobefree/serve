import { IonIcon, IonImg } from "@ionic/react";
import { chatbox, search } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

import { userStore } from "../../domains/auth/sessionStore";
import { IMAGE_SIZE } from "../../domains/image";
import { getPublicUrl, profilePicturePath } from "../../domains/image/image";
import { DEVICE, DEVICE_TYPE } from "../../domains/ui/device";
import { HEADER_HEIGHT } from "../../domains/ui/header";
import { mayReplace } from "../../domains/ui/navigation";
import { useVisibleRef } from "../../domains/ui/useVisibleRef";
import { useModals, useNavigate } from "../../router";

import Avatar from "../Avatar";

type Props = {
  handle?: string;
  userId?: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export function HeaderComponent({ userId, isVisible, setIsVisible }: Props) {
  const navigate = useNavigate();
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [ref, refIsVisible] = useVisibleRef();
  const modals = useModals();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;

      if (currentScrollTop > lastScrollTop && !refIsVisible) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollTop(currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop, refIsVisible, setIsVisible]);

  return (
    <>
      <div
        className={`
        h-${HEADER_HEIGHT} fixed inset-0
        ${DEVICE.PLATFORM === DEVICE_TYPE.ios ? "top-16" : "top-0"}
        left-0 right-0 bg-[#004681] text-white
        transition-transform duration-300 ease-in-out z-10
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
      >
        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-2 p-2 cursor-pointer"
            onClick={() => {
              navigate("/home", { replace: mayReplace() });
            }}
          >
            <IonImg
              alt="Serve to be Free"
              src="/pwa-192x192.png"
              className="h-12 w-12"
            />
            <div className="hidden md:block text-lg">Serve to be Free</div>
          </div>
          <div className="flex items-center gap-4 pr-2">
            {/* Search input */}
            <div
              className={"flex cursor-pointer"}
              onClick={() => {
                modals.open("/search");
              }}
            >
              <IonIcon
                icon={search}
                className="text-3xl p-3 rounded-full bg-[#ffffff22]"
              />
            </div>

            {/* Messages */}
            {userId && (
              <div
                className={"flex cursor-pointer"}
                onClick={() => {
                  modals.open("/messages");
                }}
              >
                <IonIcon
                  icon={chatbox}
                  className="text-3xl p-3 rounded-full bg-[#ffffff22]"
                />
              </div>
            )}

            {/* Profile */}
            <div
              className={`flex justify-center items-center cursor-pointer`}
              onClick={() => {
                modals.open("/menu");
              }}
            >
              {userId && (
                <Avatar
                  size={IMAGE_SIZE.AVATAR_SMALL}
                  alt={"Profile picture"}
                  src={getPublicUrl(profilePicturePath(userId))}
                />
              )}
              {!userId && <div>Login</div>}
            </div>
          </div>
        </div>
      </div>
      {/* Use the space for the header at the top */}
      <div className={`h-${HEADER_HEIGHT} w-fit bg-[#004681]`} ref={ref}></div>
      {/* Use the space for the header at the top */}
      <div
        className={`
        h-${HEADER_HEIGHT} w-fit bg-[#004681] 
        ${DEVICE.PLATFORM === DEVICE_TYPE.ios ? "" : "hidden"}
        `}
      ></div>
    </>
  );
}

const Header = observer(
  (props: Omit<Props, "handle" | "avatarUrl" | "isSearchVisible">) => {
    return (
      <HeaderComponent
        {...props}
        handle={userStore.current?.id}
        userId={userStore.current?.id}
      />
    );
  }
);

export default Header;
