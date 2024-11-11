import { IonButton } from "@ionic/react";
import { useEffect, useState } from "react";

import { mayReplace } from "../domains/ui/navigation";
import { useNavigate } from "../router"

export default function Add() {
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    // Toggle the overflow-hidden class on the body when modal opens/closes
    document.body.classList.add('overflow-hidden');
    setOpen(true)

    // Clean up the class when the component unmounts
    return () => { document.body.classList.remove('overflow-hidden') };
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex`}>
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
          <IonButton onClick={() => { navigate(-1) }}>Give Service</IonButton>
          <IonButton onClick={() => {
            navigate('/project/new', { replace: mayReplace() });
          }}>Create a Project</IonButton>
        </div>
      </div>
    </div>
  )
}
