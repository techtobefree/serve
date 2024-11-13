import { observable, runInAction } from "mobx";

type Search = {
  text: string;
  isSearchVisible: boolean;
}

export const searchStore = observable<Search>({
  text: '',
  isSearchVisible: false
})

export function setSearchText(text: string) {
  runInAction(() => {
    searchStore.text = text;
  })
}

export function showSearchResults() {
  runInAction(() => {
    searchStore.isSearchVisible = true;
  })
}
export function hideSearchResults() {
  runInAction(() => {
    searchStore.isSearchVisible = false;
  })
}
