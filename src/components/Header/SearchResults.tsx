import { IonIcon } from "@ionic/react";
import { funnelOutline, closeOutline } from "ionicons/icons";
import { useEffect, useState } from "react";

import { HEADER_HEIGHT } from "../../domains/ui/header";

type Props = {
  isVisible: boolean;
  searchText: string;
  setResultVisible: (visible: boolean) => void;
}

export default function SearchResults({ isVisible, searchText, setResultVisible }: Props) {
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
          onClick={() => { setResultVisible(false) }}>
          <IonIcon icon={closeOutline} className='text-3xl' />
        </div>
      </div>

      {/* Search results */}
      <div className='bg-[#62aacb] pointer-events-auto h-full'>
        {isVisible &&
          <div className='max-h-[calc(100vh-64px)] text-black overflow-auto'>
            {/* Modal Body */}
            {!!filters.length &&
              <div className="p-6 text-gray-700">Filters: {filters.join(', ')}</div>
            }
            <div className="p-6 text-gray-700">Search projects, people, groups</div>
            <div className="p-6 text-gray-700">Coming soon... {searchText}</div>
          </div>}
      </div>
    </>
  )
}
