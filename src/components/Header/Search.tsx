import { IonIcon } from "@ionic/react";
import { search } from "ionicons/icons";
import { useState } from "react";
import { searchStore, setSearchText } from "../../domains/search/search";
import { observer } from "mobx-react-lite";

type Props = {
  searchText: string;
  onFocus: () => void;
}

export function SearchComponent({ searchText, onFocus }: Props) {
  const [isFocused, setFocused] = useState(false);

  return (
    <div className={`flex items-center rounded relative
            overflow-hidden border-blue-300 ${isFocused ? 'border-2' : 'border'}`}>
      <input className={`bg-inherit pl-6 ${isFocused ? 'bg-[#222222]' : ''}`}
        type="text"
        value={searchText}
        onFocus={() => {
          onFocus();
          setFocused(true);
        }}
        onBlur={() => { setFocused(false) }}
        onChange={(e) => { setSearchText(e.target.value) }}
      />
      <IonIcon className="absolute left-1" slot="start" icon={search} aria-hidden="true" />
    </div>
  )
}

const Search = observer(({ onFocus }: Omit<Props, 'searchText'>) => {
  return <SearchComponent onFocus={onFocus} searchText={searchStore.text} />
})

export default Search;
