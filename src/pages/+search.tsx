import { IonButton, IonIcon, IonInput } from "@ionic/react";
import { arrowBack, arrowUpRightBox, filter, search } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import GroupResults from "../components/Header/GroupResults";
import PeopleResults from "../components/Header/PeopleResults";
import ProjectResults from "../components/Header/ProjectResults";
import { Category, searchStore, setSearchText } from "../domains/search/search";
import { mayReplace } from "../domains/ui/navigation";
import { useModals, useNavigate } from "../router"

type Props = {
  searchText: string;
  categoriesToShow: Category[];
}

export function SearchResultsComponent({
  searchText,
  categoriesToShow,
}: Props) {
  const modals = useModals();
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    // Toggle the backdrop-no-scroll class on the body when modal opens/closes
    document.body.classList.add('backdrop-no-scroll');
    setOpen(true);

    // Clean up the class when the component unmounts
    return () => { document.body.classList.remove('backdrop-no-scroll') };
  }, []);

  return (
    <div className={`fixed inset-0 z-10 flex`}>
      {/* Backdrop */}
      <div
        onClick={() => { navigate(-1) }}
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity opacity-100`}
      ></div>

      {/* Modal Content */}
      <div
        className={`
          fixed overflow-auto right-0 top-[64px] bottom-[64px] w-full bg-white
          shadow-lg transform transition-transform duration-300 ease-in-out
          flex justify-center
          ${isOpen ? 'translate-y-0' : '-translate-y-full'}
          `}
      >
        <div className='max-w-[800px] flex flex-col flex-grow'>
          <div className='max-w-[100vw] p-2'>
            <div className='flex justify-between items-center'>
              <div>
                <IonIcon className='cursor-pointer text-4xl'
                  icon={arrowBack}
                  onClick={() => { modals.close() }} />
              </div>
              <IonInput
                labelPlacement="stacked"
                className='w-[400px] border-2 border-gray-300 rounded-full'
                placeholder="Search"
                value={searchText}
                onIonChange={(e) => { setSearchText(e.detail.value || '') }}>
                <IonIcon className='pl-6 p-2' size="large" slot='start'
                  icon={search} aria-hidden="true" />
                <IonButton fill="clear" slot="end" aria-label="Show/hide">
                  <IonIcon slot="icon-only" name={arrowUpRightBox} aria-hidden="true"></IonIcon>
                </IonButton>
              </IonInput>
              <IonIcon size="large" slot="start" icon={filter} aria-hidden="true" />
            </div>
            {!!categoriesToShow.length &&
              <div className="p-6">Filters: {categoriesToShow.join(', ')}</div>
            }
            <div className="p-6">(Search/filters coming soon)</div>
            <IonButton
              className='self-center'
              color="secondary" onClick={() => {
                navigate('/project/new', { replace: mayReplace() });
              }}>Create a Project</IonButton>
            {/* Modal Body */}

            <ProjectResults />
            <PeopleResults />
            <GroupResults />
          </div>
        </div>
      </div>
    </div>
  )
}

const SearchResults = observer(() => {
  return <SearchResultsComponent
    categoriesToShow={searchStore.categoriesToShow}
    searchText={searchStore.text} />
})

export default SearchResults;
