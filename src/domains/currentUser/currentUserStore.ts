import { observable, runInAction } from "mobx"

export type CurrentProfile = {
  userId?: string,
  handle?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  acceptedAt?: string,
}

export const currentProfileStore = observable<CurrentProfile>({})

export function setCurrentProfile(user: CurrentProfile) {
  runInAction(() => {
    currentProfileStore.userId = user.userId
    currentProfileStore.handle = user.handle
    currentProfileStore.email = user.email
    currentProfileStore.firstName = user.firstName
    currentProfileStore.lastName = user.lastName
    currentProfileStore.acceptedAt = user.acceptedAt
  })
}
