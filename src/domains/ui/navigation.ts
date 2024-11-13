/**
 * This will ensure that there is a final "back" to the home page, before exiting the application while using it natively (or on the web).
 */
import { observable, runInAction } from "mobx"

export const historyStore = observable({ replace: true })

export function shouldReplaceHistory(itShould: boolean) {
  runInAction(() => {
    historyStore.replace = itShould;
  })
}

export function mayReplace() {
  return historyStore.replace
}

const { protocol, hostname, port } = window.location;
export const BASE_URL = `${protocol}//${hostname}${port ? `:${port}` : ''}`
