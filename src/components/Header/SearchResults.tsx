import { IonIcon } from "@ionic/react";
import { funnelOutline, closeOutline } from "ionicons/icons";
import { useEffect, useState } from "react";

import { HEADER_HEIGHT } from "../../domains/ui/header";
import { useAllProjectsQuery } from "../../queries/allProjects";
import ProjectCard from "../Project/ProjectCard";
import PulsingCard from "../Project/PulsingCard";
import { hideSearchResults, searchStore } from "../../domains/search/search";
import { observer } from "mobx-react-lite";

type Props = {
  isHeaderVisible: boolean;
  searchText: string;
}

export function SearchResultsComponent({ isHeaderVisible, searchText }: Props) {
  const { data: projects, isLoading, isError } = useAllProjectsQuery();

  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    // Toggle the overflow-hidden class on the body when modal opens/closes
    document.body.classList.add('overflow-hidden');

    // Clean up the class when the component unmounts
    return () => { document.body.classList.remove('overflow-hidden') };
  }, []);

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
      <div className='flex justify-center bg-[#62aacb] pointer-events-auto h-full'>
        {isHeaderVisible &&
          <div className='max-h-[calc(100vh-64px)] max-w-[800px] text-black overflow-auto'>
            {/* Modal Body */}
            {!!filters.length &&
              <div className="p-6 text-gray-700">Filters: {filters.join(', ')}</div>
            }
            <div className="p-6 text-gray-700">Search/filters (coming soon)</div>

            <div>Projects</div>
            <div className="max-w-[800px] flex-1 flex-col gap-2 flex">
              {isError && <div className='text-3xl p-3'>Error loading projects</div>}
              {isLoading && <>
                <PulsingCard />
                <PulsingCard />
                <PulsingCard />
              </>}
              {projects?.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
            <div>People</div>
            <div className="p-6 text-gray-700">(Coming soon) No people found searching for "{searchText}"</div>
            <div>Groups</div>
            <div className="p-6 text-gray-700">(Coming soon) No groups found searching for "{searchText}"</div>
          </div>}
      </div>
    </>
  )
}

const SearchResults = observer(({ isHeaderVisible }: Omit<Props, 'searchText'>) => {
  return <SearchResultsComponent isHeaderVisible={isHeaderVisible} searchText={searchStore.text} />
})

export default SearchResults;
