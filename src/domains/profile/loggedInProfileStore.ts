import { observable, runInAction } from "mobx"

export type LoggedInProfile = {
  userId?: string,
  handle?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  acceptedAt?: string,
}

export const loggedInProfileStore = observable<LoggedInProfile>({})

export function setCurrentProfile(user: LoggedInProfile) {
  runInAction(() => {
    loggedInProfileStore.userId = user.userId
    loggedInProfileStore.handle = user.handle
    loggedInProfileStore.email = user.email
    loggedInProfileStore.firstName = user.firstName
    loggedInProfileStore.lastName = user.lastName
    loggedInProfileStore.acceptedAt = user.acceptedAt
  })
}
