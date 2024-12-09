import { App as CapacitorApp } from '@capacitor/app';
import { Session } from '@supabase/supabase-js';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'

import Header from '../components/Header/Header';
import { sessionStore } from '../domains/auth/sessionStore';
import { CurrentUser, currentUserStore } from '../domains/currentUser/currentUserStore';
import { useLocalAuth } from '../hooks/useLocalAuth';
import { useProfileQuery } from '../queries/profileByUserId';
import { useNavigate } from '../router';

import { UserView } from './(header)/user/[userId]/view';


type Props = {
  session?: Session | null;
  currentUser: CurrentUser;
}

export function LayoutComponent({ session }: Props) {
  useLocalAuth(); // Comment if you want to test logged out state
  useProfileQuery(session?.user.id);
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

  if (currentUserStore.userId && (
    !currentUserStore.handle ||
    !currentUserStore.email ||
    !currentUserStore.firstName ||
    !currentUserStore.lastName ||
    !currentUserStore.acceptedTerms
  )) {
    // Sorry for this
    return (
      <div className='bg-[#f0f0f0]'>
        <Header isVisible={true} setIsVisible={() => { }} />
        <UserView userId={currentUserStore.userId} canEdit={true} initial />
      </div>
    )
  }

  return (
    <div className='bg-[#f0f0f0]'>
      <Outlet />
    </div>
  )
}

const Layout = observer(() => {
  return (
    <LayoutComponent session={sessionStore.current} currentUser={{ ...currentUserStore }} />
  )
})

export default Layout;
