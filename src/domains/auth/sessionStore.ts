import { Session, User } from "@supabase/supabase-js";
import { observable, runInAction } from "mobx"

import { clientSupabase } from "../db/clientSupabase";

export type SupabaseUser = {
  current?: User | null,
  session?: Session | null,
}

export const userStore = observable<SupabaseUser>({})

// TODO: check this - it should be preferred, but it seems to logout the user every refresh
// void clientSupabase.auth.getUser().then(({ data: { user } }) => {
//   runInAction(() => {
//     userStore.current = user;
//   })
// })

void clientSupabase.auth.getSession().then(({ data: { session } }) => {
  runInAction(() => {
    userStore.session = session;
    userStore.current = session?.user;
  })
})

clientSupabase.auth.onAuthStateChange((_event, session) => {
  runInAction(() => {
    userStore.current = session?.user;
    userStore.session = session;
  })
})
