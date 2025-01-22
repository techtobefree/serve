import { IonIcon } from "@ionic/react";
import { search, starOutline, heartOutline, add } from "ionicons/icons";
import { useEffect, useState } from "react";

import { Category, filterSearchToCategories } from "../domains/search/search";
import { useModals, useNavigate } from "../router"

export default function Add() {
  const navigate = useNavigate();
  const modals = useModals();
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    // Toggle the backdrop-no-scroll class on the body when modal opens/closes
    document.body.classList.add('backdrop-no-scroll');
    setOpen(true)

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
          pointer-events-none fixed flex justify-center items-end md:items-start overflow-auto
          left-0 top-0 h-full w-full transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full md:-translate-y-full'}
          `}
      >
        <div className='rounded-2xl bg-white flex flex-col gap-4 p-4
          pointer-events-auto h-fit m-16'>
          <div className='w-60 border-2 border-black p-2 shadow-lg
          rounded-full flex justify-center items-center relative cursor-pointer'
            onClick={() => {
              filterSearchToCategories([Category.project])
              modals.open('/search', { replace: true })
            }} >
            <IonIcon className='absolute left-2 text-2xl text-[#1a237e]' icon={search} />
            Find a Project
          </div>
          <div className='w-60 border-2 border-black p-2 shadow-lg
          rounded-full flex justify-center items-center relative cursor-pointer'
            onClick={() => {
              navigate('/project/new', { replace: true })
            }} >
            <IonIcon className='absolute left-2 text-2xl text-[#f50057]' icon={add} />
            Create a Project
          </div>
          {/* <div className='w-60 border-2 border-black p-2 shadow-lg
          rounded-full flex justify-center items-center relative cursor-pointer'
            onClick={() => {
              filterSearchToCategories([Category.project])
              modals.open('/search', { replace: true })
            }} >
            <IonIcon className='absolute left-2 text-2xl text-[#1e88e6]' icon={starOutline} />
            Lead a Project
          </div>
          <div className='w-60 border-2 border-black p-2 shadow-lg
          rounded-full flex justify-center items-center relative cursor-pointer'
            onClick={() => {
              filterSearchToCategories([Category.project])
              modals.open('/search', { replace: true })
            }} >
            <IonIcon className='absolute left-2 text-2xl text-[#ffcb1e]' icon={heartOutline} />
            Sponsor a Project
          </div> */}
        </div>
      </div>
    </div>
  )
}
