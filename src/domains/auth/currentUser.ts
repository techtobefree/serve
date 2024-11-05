import { Session } from "@supabase/supabase-js";
import { observable, runInAction } from "mobx"

export type CurrentUser = {
  handle?: string,
  avatarUrl?: string,
  loggedIn: boolean,
}

export const currentUserStore = observable<CurrentUser>({
  loggedIn: false
})

export function onLogin(session?: Session | null) {
  if (session) {
    runInAction(() => {
      currentUserStore.loggedIn = true;
      currentUserStore.handle = session.user.id;
    })
  } else {
    runInAction(() => {
      delete currentUserStore.handle;
      currentUserStore.loggedIn = false;
    })
  }
}
