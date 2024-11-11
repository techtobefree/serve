import { Outlet, useLocation } from 'react-router-dom'
import { useNavigate } from '../router';
import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Mimics browser back navigation behavior for native apps using @capacitor/app
   */
  useEffect(() => {
    const handleBackButton = () => {
      if (location.pathname !== '/') {
        navigate(-1);
      } else {
        void CapacitorApp.exitApp();
      }
    };

    void CapacitorApp.addListener('backButton', handleBackButton);

    return () => {
      void CapacitorApp.removeAllListeners();
    };
  }, [navigate, location]);

  return (
    <Outlet />
  )
}
