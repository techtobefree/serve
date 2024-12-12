import { useEffect } from "react";

import { sessionStore } from "../domains/auth/sessionStore";
import { supabase } from "../domains/db/supabaseClient";
import { useNavigate } from "../router";

const IS_LOCAL = import.meta.env.VITE_LOCAL as string;
const LOCAL_AUTH_EMAIL = import.meta.env.VITE_LOCAL_AUTH_EMAIL as string;
const LOCAL_AUTH_PASSWORD = import.meta.env.VITE_LOCAL_AUTH_PASSWORD as string;

export function useLocalAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    if (IS_LOCAL && !sessionStore.current?.user) {
      setTimeout(() => {
        if (!sessionStore.current?.user) {
          const auth = async () => {
            await supabase.auth.signInWithPassword({
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
