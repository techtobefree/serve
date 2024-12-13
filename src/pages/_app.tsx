import { App as CapacitorApp } from '@capacitor/app';
import { User } from '@supabase/supabase-js';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'

import Toast from '../components/Toast';
import { userStore } from '../domains/auth/sessionStore';
import { CurrentProfile, currentProfileStore } from '../domains/currentUser/currentUserStore';
import { useLocalAuth } from '../hooks/useLocalAuth';
import { useProfileQuery } from '../queries/profileByUserId';
import { useNavigate } from '../router';

// eslint-disable-next-line import/namespace
import { UserView } from './(header)/user/[userId]/view';


type Props = {
  user?: User | null;
  currentProfile: CurrentProfile;
}

export function LayoutComponent({ currentProfile, user }: Props) {
  useLocalAuth(); // Comment if you want to test logged out state
  useProfileQuery(user?.id);
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

  if (currentProfile.userId && (
    !currentProfile.handle ||
    !currentProfile.email ||
    !currentProfile.firstName ||
    !currentProfile.lastName ||
    !currentProfile.acceptedAt
  )) {
    // Sorry for this
    return (
      <div className='bg-[#f0f0f0]'>
        <UserView userId={currentProfile.userId}
          canEdit={true}
          acceptedAt={currentProfile.acceptedAt}
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
    <LayoutComponent user={userStore.current} currentProfile={{ ...currentProfileStore }} />
  )
})

export default Layout;
