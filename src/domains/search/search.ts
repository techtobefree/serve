import { observable, runInAction } from "mobx";

export enum Category {
  group = 'group',
  person = 'person',
  project = 'project',
}

type Search = {
  text: string;
  isSearchVisible: boolean;
  hasCategoryInFilter: Category[];
}

export const searchStore = observable<Search>({
  text: '',
  isSearchVisible: false,
  hasCategoryInFilter: []
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

export function filterSearchToCategories(categories: Category[]) {
  runInAction(() => {
    searchStore.hasCategoryInFilter = categories;
  })
}
