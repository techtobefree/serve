import { IonButton, IonIcon } from "@ionic/react";
import { funnelOutline, closeOutline } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { hideSearchResults, searchStore } from "../../domains/search/search";
import { HEADER_HEIGHT } from "../../domains/ui/header";
import { mayReplace } from "../../domains/ui/navigation";
import { useNavigate } from "../../router";

import GroupResults from "./GroupResults";
import PeopleResults from "./PeopleResults";
import ProjectResults from "./ProjectResults";

type Props = {
  isHeaderVisible: boolean;
  isSearchVisible: boolean;
  searchText: string;
}

export function SearchResultsComponent({
  isHeaderVisible,
  isSearchVisible,
}: Props) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    if (isHeaderVisible && isSearchVisible) {
      // Toggle the backdrop-no-scroll class on the body when modal opens/closes
      document.body.classList.add('backdrop-no-scroll');

      // Clean up the class when the component unmounts
      return () => { document.body.classList.remove('backdrop-no-scroll') };
    }
  }, [isHeaderVisible, isSearchVisible]);

  return (
    <>
      {/* Pseudo header */}
      <div className="flex justify-between items-end">
        <div className={`
            pointer-events-auto text-lg cursor-pointer
            bg-[#f0f0f0] h-${HEADER_HEIGHT} flex w-20 justify-center items-center
          `}
          onClick={() => {
            setFilters(filters.concat('+1'))
          }}>
          <IonIcon icon={funnelOutline} className='text-3xl' />
        </div>
        <div>
          <svg width="16" height="16" viewBox="0 0 16 16"
            style={{ backgroundColor: '#f0f0f0' }}>
            <path d="M 16 16 A 16 16 0 0 1 0 0 L 16 0 Z" fill="#004681" />
          </svg>
        </div>
        <div className='flex-grow'></div>
        <div>
          <svg width="16" height="16" viewBox="0 0 16 16"
            style={{ backgroundColor: '#f0f0f0' }}>
            <path d="M 16 0 A 16 16 0 0 1 0 16 L 0 0 Z" fill="#004681" />
          </svg>
        </div>
        <div className={`
                pointer-events-auto cursor-pointer
                bg-[#f0f0f0] h-${HEADER_HEIGHT} flex w-20 justify-center items-center
              `}
          onClick={() => { hideSearchResults() }}>
          <IonIcon icon={closeOutline} className='text-4xl' />
        </div>
      </div>

      {/* Search results */}
      <div className='flex justify-center pointer-events-auto h-full text-black'>
        {isHeaderVisible && isSearchVisible &&
          <div className='h-[calc(100vh-64px)] w-full overflow-auto flex flex-col'>
            <div className='w-full flex flex-col items-center bg-[#f0f0f0] p-2'>
              <div className='max-w-[800px] flex flex-col'>
                <IonButton
                  className='self-center'
                  color="secondary" onClick={() => {
                    hideSearchResults();
                    navigate('/project/new', { replace: mayReplace() });
                  }}>Create a Project</IonButton>
                {/* Modal Body */}
                {!!filters.length &&
                  <div className="p-6">Filters: {filters.join(', ')}</div>
                }
                <div className="p-6">(Search/filters coming soon)</div>

                <ProjectResults />
                <PeopleResults />
                <GroupResults />
              </div>
            </div>
            <div className="flex-grow w-full bg-[#000000aa]"
              onClick={() => {
                hideSearchResults();
              }}>
            </div>
          </div>}
      </div>
    </>
  )
}

const SearchResults = observer(({ isHeaderVisible }:
  Omit<Props, 'searchText' | 'isSearchVisible'>) => {
  return <SearchResultsComponent
    isHeaderVisible={isHeaderVisible}
    isSearchVisible={searchStore.isSearchVisible}
    searchText={searchStore.text} />
})

export default SearchResults;
