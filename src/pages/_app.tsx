import { App as CapacitorApp } from '@capacitor/app';
import { IonButton } from '@ionic/react';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom'

import { Profile } from '../components/Profile/Profile';
import Toast from '../components/Toast';
import { userStore } from '../domains/auth/sessionStore';
import { useLocalAuth } from '../domains/auth/useLocalAuth';
import { useProfileQuery } from '../domains/profile/queryProfileByUserId';
import { showToast } from '../domains/ui/toast';
import { useNavigate } from '../router';

type Props = { userId?: string }

export function LayoutComponent({ userId }: Props) {
  useLocalAuth();
  const { data: profile } = useProfileQuery(userStore.current?.id);
  const navigate = useNavigate();
  const location = useLocation();

  const serviceWorkerChangeCallback = useMemo(() => () => {
    showToast(<div>
      A new version of the app is available. Please refresh the page.
      <IonButton onClick={() => { window.location.reload() }}>Refresh</IonButton>
    </div>, { duration: Infinity });
  }, [])

  useEffect(() => {
    navigator.serviceWorker.addEventListener('controllerchange', serviceWorkerChangeCallback);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', serviceWorkerChangeCallback);
    }
  })

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
    !profile?.handle ||
    !profile.sensitive_profile[0].accepted_at
  )) {
    // Sorry for this
    return (
      <div className='bg-[#f0f0f0]'>
        <Profile userId={userId}
          canEdit={true}
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
    <LayoutComponent userId={userStore.current?.id} />
  )
})

export default Layout;
