import { useState, useEffect } from "react";
import { menuOutline, personOutline } from "ionicons/icons";
import { useVisibleRef } from "../../hooks/useVisibleRef";
import { HEADER_HEIGHT } from "../../constants/header";
import { IonIcon } from "@ionic/react";

type Props = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Header({ isVisible, setIsVisible }: Props) {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [ref, refIsVisible] = useVisibleRef();

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
      <div className={`h-${HEADER_HEIGHT} fixed top-0 left-0 right-0 bg-gray-800 text-white transition-transform duration-300 ease-in-out z-10 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className='flex justify-between items-center'>
          <div className={`h-${HEADER_HEIGHT} flex w-20 justify-center items-center cursor-pointer text-blue-500`}>
            <IonIcon icon={personOutline} className='text-2xl' />
          </div>
          <div>Serve 2 Free</div>
          <div className={`h-${HEADER_HEIGHT} flex w-${HEADER_HEIGHT} justify-center items-center cursor-pointer text-blue-500`}>
            <IonIcon icon={menuOutline} className='text-2xl' />
          </div>
        </div>
      </div>
      <div className={`h-${HEADER_HEIGHT}`} ref={ref}></div>{/* Use the space for the header at the top */}
    </>
  )
}
