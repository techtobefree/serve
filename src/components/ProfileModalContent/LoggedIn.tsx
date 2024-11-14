import { IonButton, IonIcon } from "@ionic/react";
import { checkbox, closeOutline, createOutline } from "ionicons/icons";

import { useEffect, useRef, useState } from "react";

import { logout } from "../../domains/auth/smsOTP";
import { changeHandle } from "../../queries/myProfile";
import { useNavigate } from "../../router";

type Props = {
  handle: string;
  userId: string;
}

export default function LoggedIn({ handle, userId }: Props) {
  const [inEditMode, setEditMoade] = useState(false);
  const [name, setName] = useState(handle);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inEditMode])

  return (
    <>
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-gray-200 p-4">
        {!inEditMode &&
          <div className="flex items-center cursor-pointer" onClick={() => { setEditMoade(true) }}>
            <IonIcon icon={createOutline} className='text-xl p-1 text-blue-500' />
            <h2 className="text-lg font-semibold">
              {handle}
            </h2>
          </div>
        }
        {inEditMode &&
          <div className='flex items-center'>
            <IonIcon icon={checkbox}
              className='cursor-pointer text-2xl p-1 text-blue-500'
              onClick={() => {
                void changeHandle(userId, name)
                setEditMoade(false)
              }}
            />
            <input ref={inputRef}
              value={name}
              onChange={(event) => { setName(event.target.value) }}
            />
          </div>
        }

        {/* Close Button */}
        <button
          onClick={() => { navigate(-1) }}
        >
          <IonIcon className="text-4xl text-blue-500" icon={closeOutline} />
        </button>
      </div>

      {/* Modal Content */}
      <div className="p-4">
        <IonButton onClick={() => { void logout() }}>Logout</IonButton>
      </div>
    </>
  )
}
