import { IonIcon } from "@ionic/react";
import { funnelOutline, closeOutline } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { hideSearchResults, searchStore } from "../../domains/search/search";
import { HEADER_HEIGHT } from "../../domains/ui/header";

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
  const location = useLocation();

  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    if (isHeaderVisible && isSearchVisible) {
      // Toggle the overflow-hidden class on the body when modal opens/closes
      document.body.classList.add('overflow-hidden');

      // Clean up the class when the component unmounts
      return () => { document.body.classList.remove('overflow-hidden') };
    }
  }, [isHeaderVisible, isSearchVisible]);

  useEffect(() => {
    if (isSearchVisible && location.pathname !== '/map') {
      hideSearchResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <>
      {/* Pseudo header */}
      <div className="flex justify-between items-end">
        <div className={`
            pointer-events-auto text-lg cursor-pointer
            bg-[#62aacb] h-${HEADER_HEIGHT} flex w-20 justify-center items-center
          `}
          onClick={() => {
            setFilters(filters.concat('+1'))
          }}>
          <IonIcon icon={funnelOutline} className='text-3xl' />
        </div>
        <div>
          <svg width="16" height="16" viewBox="0 0 16 16"
            style={{ backgroundColor: '#62aacb' }}>
            <path d="M 16 16 A 16 16 0 0 1 0 0 L 16 0 Z" fill="#1f2937" />
          </svg>
        </div>
        <div className='flex-grow'></div>
        <div>
          <svg width="16" height="16" viewBox="0 0 16 16"
            style={{ backgroundColor: '#62aacb' }}>
            <path d="M 16 0 A 16 16 0 0 1 0 16 L 0 0 Z" fill="#1f2937" />
          </svg>
        </div>
        <div className={`
                pointer-events-auto cursor-pointer
                bg-[#62aacb] h-${HEADER_HEIGHT} flex w-20 justify-center items-center
              `}
          onClick={() => { hideSearchResults() }}>
          <IonIcon icon={closeOutline} className='text-3xl' />
        </div>
      </div>

      {/* Search results */}
      <div className='flex justify-center pointer-events-auto h-full'>
        {isHeaderVisible && isSearchVisible &&
          <div className='h-[calc(100vh-64px)] w-full text-black overflow-auto flex flex-col'>
            <div className='w-full flex flex-col items-center bg-[#62aacb]'>
              <div className='max-w-[800px]'>
                {/* Modal Body */}
                {!!filters.length &&
                  <div className="p-6 text-gray-700">Filters: {filters.join(', ')}</div>
                }
                <div className="p-6 text-gray-700">(Search/filters coming soon)</div>

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
