import { Session } from "@supabase/supabase-js";
import { observable, runInAction } from "mobx"

import { supabase } from "../db/supabaseClient";

export type SupabaseSession = {
  current?: Session | null,
}

export const sessionStore = observable<SupabaseSession>({})

void supabase.auth.getSession().then(({ data: { session } }) => {
  runInAction(() => {
    sessionStore.current = session;
  })
})

supabase.auth.onAuthStateChange((_event, session) => {
  runInAction(() => {
    sessionStore.current = session;
  })
})
