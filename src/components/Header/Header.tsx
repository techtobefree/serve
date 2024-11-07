import { useState, useEffect } from "react";
import { menuOutline, personCircle } from "ionicons/icons";
import { useVisibleRef } from "../../hooks/useVisibleRef";
import { HEADER_HEIGHT } from "../../domains/ui/header";
import { IonIcon } from "@ionic/react";
import { DEVICE, DEVICE_TYPE } from "../../domains/ui/device";
import { useModals } from '../../router'
import { observer } from "mobx-react-lite";
import { sessionStore } from "../../domains/auth/sessionStore";

type Props = {
  handle?: string;
  avatarUrl?: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export function HeaderComponent({ isVisible, setIsVisible }: Props) {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [ref, refIsVisible] = useVisibleRef();
  const modals = useModals()

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

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop, refIsVisible, setIsVisible]);

  return (
    <>
      <div className={
        `h-${HEADER_HEIGHT} fixed inset-0 ${DEVICE.PLATFORM === DEVICE_TYPE.ios ? 'top-16' : 'top-0'}
        left-0 right-0 bg-gray-800 text-white transition-transform duration-300 ease-in-out z-10
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}`
      }>
        <div className='flex justify-between items-center'>
          <div className={`h-${HEADER_HEIGHT} flex w-20 justify-center items-center cursor-pointer text-blue-500`}
            onClick={() => { modals.open('/profile') }}>
            <IonIcon icon={personCircle} className='text-3xl' />
          </div>
          <div>Serve 2 free</div>
          <div className={`h-${HEADER_HEIGHT} flex w-${HEADER_HEIGHT} justify-center items-center cursor-pointer text-blue-500`}
            onClick={() => { modals.open('/menu') }}>
            <IonIcon icon={menuOutline} className='text-3xl' />
          </div>
        </div>
      </div>
      {/* Use the space for the header at the top */}
      <div className={`h-${HEADER_HEIGHT} w-fit bg-gray-800`} ref={ref}></div>
      {/* Use the space for the header at the top */}
      <div className={`h-${HEADER_HEIGHT} w-fit bg-gray-800 ${DEVICE.PLATFORM === DEVICE_TYPE.ios ? '' : 'hidden'}`}></div>
    </>
  )
}

const Header = observer((props: Omit<Props, 'handle' | 'avatarUrl'>) => {
  return <HeaderComponent {...props} handle={sessionStore.current?.user.id} avatarUrl={sessionStore.current?.user.id} />
});

export default Header;
