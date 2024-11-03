import { useState, useEffect } from "react";
import { useVisibleRef } from "../../hooks/useVisibleRef";

const HEADER_HEIGHT_CLASS = 'h-16';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
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
  }, [lastScrollTop, refIsVisible]);

  return (
    <>
      <div className={`${HEADER_HEIGHT_CLASS} fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 transition-transform duration-300 ease-in-out z-10 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        Header
      </div>
      <div className={HEADER_HEIGHT_CLASS} ref={ref}></div>
    </>
  )
}
