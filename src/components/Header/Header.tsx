import { IonIcon } from "@ionic/react";
import { chatbox, personCircle } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

import { sessionStore } from "../../domains/auth/sessionStore";
import { searchStore, showSearchResults } from "../../domains/search/search";
import { DEVICE, DEVICE_TYPE } from "../../domains/ui/device";
import { HEADER_HEIGHT } from "../../domains/ui/header";
import { useVisibleRef } from "../../hooks/useVisibleRef";
import { useModals } from '../../router'

import Search from "./Search";
import SearchResults from "./SearchResults";

type Props = {
  handle?: string;
  avatarUrl?: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchVisible: boolean;
}

export function HeaderComponent({ isVisible, setIsVisible, isSearchVisible }: Props) {
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
      <div className={`
        h-${HEADER_HEIGHT} fixed inset-0
        ${DEVICE.PLATFORM === DEVICE_TYPE.ios ? 'top-16' : 'top-0'}
        left-0 right-0 bg-[#004681] text-white
        transition-transform duration-300 ease-in-out z-10
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}>
        <div className='flex justify-between items-center'>
          {/* Profile */}
          <div className={`
            h-${HEADER_HEIGHT} flex w-16 justify-center items-center cursor-pointer
          `}
            onClick={() => { modals.open('/profile') }}>
            <IonIcon icon={personCircle} className='text-3xl border-2 p-3 rounded-2xl' />
          </div>
          <div className='hidden md:block text-lg'>
            Serve to be Free
          </div>

          {/* Search input */}
          <div className="z-30 bg-[#004681]">
            <Search onFocus={() => { showSearchResults() }} />
          </div>

          {/* Messages */}
          <div className={
            `h-${HEADER_HEIGHT} flex w-16
            justify-center items-center cursor-pointer
            `}
            onClick={() => { modals.open('/messages') }}>
            <IonIcon icon={chatbox} className='text-3xl border-2 p-3 rounded-2xl' />
          </div>
        </div>
        {
          <div className={`fixed top-0 w-full pointer-events-none z-20 overflow-hidden text-black
            transform transition-transform duration-300 ease-in-out
            ${isVisible && isSearchVisible ?
              `max-h-screen translate-y-0` : // HEADER_HEIGHT but as px (64px) not 16
              'h-[0px] -translate-y-full'}`}>
            <SearchResults isHeaderVisible={isVisible} />
          </div>
        }
      </div>
      {/* Use the space for the header at the top */}
      <div className={`h-${HEADER_HEIGHT} w-fit bg-[#004681]`} ref={ref}></div>
      {/* Use the space for the header at the top */}
      <div className={`
        h-${HEADER_HEIGHT} w-fit bg-[#004681] 
        ${DEVICE.PLATFORM === DEVICE_TYPE.ios ? '' : 'hidden'}
        `}></div>
    </>
  )
}

const Header = observer((props: Omit<Props, 'handle' | 'avatarUrl' | 'isSearchVisible'>) => {
  return <HeaderComponent {...props}
    isSearchVisible={searchStore.isSearchVisible}
    handle={sessionStore.current?.user.id}
    avatarUrl={sessionStore.current?.user.id} />
});

export default Header;
