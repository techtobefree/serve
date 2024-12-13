import { Session, User } from "@supabase/supabase-js";
import { observable, runInAction } from "mobx"

import { clientSupabase } from "../db/clientSupabase";

export type SupabaseUser = {
  current?: User | null,
  session?: Session | null,
}

export const userStore = observable<SupabaseUser>({})

void clientSupabase.auth.getUser().then(({ data: { user } }) => {
  runInAction(() => {
    userStore.current = user;
  })
})

void clientSupabase.auth.getSession().then(({ data: { session } }) => {
  runInAction(() => {
    userStore.session = session;
  })
})

clientSupabase.auth.onAuthStateChange((_event, session) => {
  runInAction(() => {
    userStore.current = session?.user;
    userStore.session = session;
  })
})
