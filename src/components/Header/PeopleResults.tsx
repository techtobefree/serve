import { observer } from "mobx-react-lite";

import { Category, searchStore } from "../../domains/search/search";
// import PulsingCard from "../People/PulsingCard";

type Props = {
  displayResults: boolean;
  searchText: string;
};

export function PeopleResultsComponent({ displayResults, searchText }: Props) {
  // const { data: persons, isLoading, isError } = useAllPeopleQuery();
  if (!displayResults) {
    return null;
  }

  return (
    <>
      <div>People</div>
      <div className="p-6">
        (Coming soon) No people found searching for {`"${searchText}"`}
      </div>
    </>
  );
}

const PeopleResults = observer(() => {
  return (
    <PeopleResultsComponent
      displayResults={
        !searchStore.categoriesToShow.length ||
        searchStore.categoriesToShow.includes(Category.person)
      }
      searchText={searchStore.text}
    />
  );
});

export default PeopleResults;
