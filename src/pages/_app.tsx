import { Outlet } from 'react-router-dom'
import { useEffect, useRef } from 'react';
import { Path, useNavigate } from '../router';

export default function Layout() {
  const navigate = useNavigate()
  const redirectRef = useRef(false);

  useEffect(() => {
    if (!redirectRef.current) {
      redirectRef.current = true;
      const originalRoute = window.location.pathname;

      // Navigate to the base route only once on the initial load
      navigate('/', { replace: true });
      navigate(originalRoute as Path);
    }

  }, [navigate]);

  return (
    <Outlet />
  )
}
