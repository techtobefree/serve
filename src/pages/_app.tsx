import { App as CapacitorApp } from '@capacitor/app';
import { Session } from '@supabase/supabase-js';
import { APIProvider } from '@vis.gl/react-google-maps';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'

import { sessionStore } from '../domains/auth/sessionStore';
import { useMyProfileQuery } from '../queries/myProfile';
import { useNavigate } from '../router';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

type Props = {
  session?: Session | null;
}

export function LayoutComponent({ session }: Props) {
  useMyProfileQuery(session?.user.id)
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
    <div className='bg-[#f0f0f0]'>
      <APIProvider apiKey={API_KEY} libraries={['places']}>
        <Outlet />
      </APIProvider>
    </div>
  )
}

const Layout = observer(() => {
  return (
    <LayoutComponent session={sessionStore.current} />
  )
})

export default Layout;
