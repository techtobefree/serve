import { App as CapacitorApp } from '@capacitor/app';
import { Session } from '@supabase/supabase-js';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'

import Toast from '../components/Toast';
import { sessionStore } from '../domains/auth/sessionStore';
import { CurrentUser, currentUserStore } from '../domains/currentUser/currentUserStore';
import { useLocalAuth } from '../hooks/useLocalAuth';
import { useProfileQuery } from '../queries/profileByUserId';
import { useNavigate } from '../router';

// eslint-disable-next-line import/namespace
import { UserView } from './(header)/user/[userId]/view';


type Props = {
  session?: Session | null;
  currentUser: CurrentUser;
}

export function LayoutComponent({ currentUser, session }: Props) {
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

  if (currentUser.userId && (
    !currentUser.handle ||
    !currentUser.email ||
    !currentUser.firstName ||
    !currentUser.lastName ||
    !currentUser.acceptedAt
  )) {
    // Sorry for this
    return (
      <div className='bg-[#f0f0f0]'>
        <UserView userId={currentUser.userId}
          canEdit={true}
          acceptedAt={currentUser.acceptedAt}
          initial />
        <Toast />
      </div>
    )
  }

  return (
    <div className='bg-[#f0f0f0]'>
      <Outlet />
      <Toast />
    </div>
  )
}

const Layout = observer(() => {
  return (
    <LayoutComponent session={sessionStore.current} currentUser={{ ...currentUserStore }} />
  )
})

export default Layout;
