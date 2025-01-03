import { App as CapacitorApp } from '@capacitor/app';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'

import { Profile } from '../components/Profile/Profile';
import Toast from '../components/Toast';
import { userStore } from '../domains/auth/sessionStore';
import { useLocalAuth } from '../domains/auth/useLocalAuth';
import { LoggedInProfile, loggedInProfileStore } from '../domains/profile/loggedInProfileStore';
import { useProfileQuery } from '../domains/profile/queryProfileByUserId';
import { useNavigate } from '../router';

 

type Props = LoggedInProfile

export function LayoutComponent({ userId, handle, acceptedAt }: Props) {
  useLocalAuth();
  useProfileQuery(userId);
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

  if (userId && (
    !handle ||
    !acceptedAt
  )) {
    // Sorry for this
    return (
      <div className='bg-[#f0f0f0]'>
        <Profile userId={userId}
          canEdit={true}
          acceptedAt={acceptedAt}
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
    <LayoutComponent userId={userStore.current?.id}
      handle={loggedInProfileStore.handle}
      email={loggedInProfileStore.email}
      firstName={loggedInProfileStore.firstName}
      lastName={loggedInProfileStore.lastName}
      acceptedAt={loggedInProfileStore.acceptedAt} />
  )
})

export default Layout;
