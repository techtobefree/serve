import { observable, runInAction } from "mobx"

export type CurrentUser = {
  userId?: string,
  handle?: string,
  email?: string,
  firstName?: string,
  lastName?: string,
  acceptedAt?: string,
}

export const currentUserStore = observable<CurrentUser>({})

export function setCurrentUser(user: CurrentUser) {
  runInAction(() => {
    currentUserStore.userId = user.userId
    currentUserStore.handle = user.handle
    currentUserStore.email = user.email
    currentUserStore.firstName = user.firstName
    currentUserStore.lastName = user.lastName
    currentUserStore.acceptedAt = user.acceptedAt
  })
}
