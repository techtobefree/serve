/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from "react";

import { useNavigate } from "../../router";
import { clientSupabase } from "../persistence/clientSupabase";

import { userStore } from "./sessionStore";

const IS_LOCAL = import.meta.env.VITE_LOCAL as string;
const LOCAL_AUTH_EMAIL = import.meta.env.VITE_LOCAL_AUTH_EMAIL as string;
const LOCAL_AUTH_PASSWORD = import.meta.env.VITE_LOCAL_AUTH_PASSWORD as string;

export function useLocalAuth() {
  if (!IS_LOCAL) return;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userStore.current) {
      setTimeout(() => {
        if (!userStore.current) {
          const auth = async () => {
            await clientSupabase.auth.signInWithPassword({
              email: LOCAL_AUTH_EMAIL,
              password: LOCAL_AUTH_PASSWORD,
            });
            navigate("/home");
          };
          void auth();
        }
      });
    }
  }, [navigate]);
}
