import { observer } from "mobx-react-lite";

import { Category, searchStore } from "../../domains/search/search";
// import PulsingCard from "../Group/PulsingCard";

type Props = {
  displayResults: boolean;
  searchText: string;
};

export function GroupResultsComponent({ displayResults, searchText }: Props) {
  // const { data: groups, isLoading, isError } = useAllGroupQuery();
  if (!displayResults) {
    return null;
  }

  return (
    <>
      <div>Group</div>
      <div className="p-6">
        (Coming soon) No people found searching for {`"${searchText}"`}
      </div>
    </>
  );
}

const GroupResults = observer(() => {
  return (
    <GroupResultsComponent
      displayResults={
        !searchStore.categoriesToShow.length ||
        searchStore.categoriesToShow.includes(Category.group)
      }
      searchText={searchStore.text}
    />
  );
});

export default GroupResults;
