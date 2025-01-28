import { observable, runInAction } from "mobx";

export enum Category {
  group = "group",
  person = "person",
  project = "project",
}

type Search = {
  text: string;
  isSearchVisible: boolean;
  categoriesToShow: Category[];
};

export const searchStore = observable<Search>({
  text: "",
  isSearchVisible: false,
  categoriesToShow: [],
});

export function setSearchText(text: string) {
  runInAction(() => {
    searchStore.text = text;
  });
}

export function filterSearchToCategories(categories: Category[]) {
  runInAction(() => {
    searchStore.categoriesToShow = categories;
  });
}
