import { useEffect } from "react";

import { userStore } from "../domains/auth/sessionStore";
import { clientSupabase } from "../domains/db/clientSupabase";
import { useNavigate } from "../router";

const IS_LOCAL = import.meta.env.VITE_LOCAL as string;
const LOCAL_AUTH_EMAIL = import.meta.env.VITE_LOCAL_AUTH_EMAIL as string;
const LOCAL_AUTH_PASSWORD = import.meta.env.VITE_LOCAL_AUTH_PASSWORD as string;

export function useLocalAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    if (IS_LOCAL && !userStore.current) {
      setTimeout(() => {
        if (!userStore.current) {
          const auth = async () => {
            await clientSupabase.auth.signInWithPassword({
              email: LOCAL_AUTH_EMAIL,
              password: LOCAL_AUTH_PASSWORD
            })
            navigate('/home')
          }
          void auth();
        }
      })
    }
  }, [navigate])
}
