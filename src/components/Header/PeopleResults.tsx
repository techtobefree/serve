import { observer } from "mobx-react-lite";

import { Category, searchStore } from "../../domains/search/search";
// import PulsingCard from "../People/PulsingCard";

type Props = {
  displayResults: boolean;
  searchText: string;
}

export function PeopleResultsComponent({ displayResults, searchText }: Props) {
  // const { data: persons, isLoading, isError } = useAllPeopleQuery();
  if (!displayResults) {
    return null
  }

  return (
    <>
      <div>People</div>
      <div className="p-6 text-gray-700">
        (Coming soon) No people found searching for {`"${searchText}"`}
      </div>
    </>
  )
}

const PeopleResults = observer(() => {
  return <PeopleResultsComponent
    displayResults={!searchStore.hasCategoryInFilter.length ||
      searchStore.hasCategoryInFilter.includes(Category.person)}
    searchText={searchStore.text}
  />
})

export default PeopleResults;
