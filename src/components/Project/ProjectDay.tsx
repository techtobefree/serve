import { IonButton, IonIcon, IonInput, IonItem } from "@ionic/react";
import { format } from "date-fns";
import { closeOutline } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

import { sessionStore } from "../../domains/auth/sessionStore";
import { blankAddress } from "../../domains/map/addressComponents";
import { useNavigate } from "../../router";
import FutureDatePicker from "../Picker.tsx/FutureDatePicker";
import LocationPicker from "../Picker.tsx/LocationPicker";

type Props = {
  projectId: string;
  userId?: string;
}

export function ProjectDayComponent({ projectId, userId }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualDate, setManualDate] = useState('');
  const [manualDateError, setManualDateError] = useState('');
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [addressName, setAddressName] = useState('');
  const [address, setAddress] = useState(blankAddress());

  useEffect(() => {
    if (date) {
      setManualDate(format(date, 'MM-dd-yyyy'))
      setManualDateError('')
    }
  }, [date])

  return (
    <div ref={modalRef}
      className='bg-white flex flex-col p-4
    max-h-[calc(100vh-32px)] pointer-events-auto overflow-auto'>
      <div className='flex flex-col items-center'>
        <div className='flex items-center mb-8 justify-between w-full'>
          <div className='text-4xl'>Create an Event</div>
          {/* Close Button */}
          <IonIcon className="text-4xl cursor-pointer"
            icon={closeOutline} onClick={() => { navigate(-1) }} />
        </div>
        <IonItem>
          <IonInput label='Date'
            labelPlacement="fixed"
            value={manualDate}
            onIonChange={(e) => {
              setManualDate(e.detail.value || '')
              if (!e.detail.value) {
                return
              }
              try {
                format(e.detail.value, 'MM-dd-yyyy')
                console.log('Valid date', format(e.detail.value, 'MM-dd-yyyy'))
                setManualDateError('')
              } catch (err) {
                setManualDateError('Invalid date, please use MM-dd-yyyy')
                console.log('Invalid date', err)
              }
            }}
          />
        </IonItem>
        {manualDateError && <div className='text-red-500'>{manualDateError}</div>}
        <div className={manualDateError ? 'border-2 border-red-500' : ''}>
          <FutureDatePicker value={date} onChange={setDate} />
        </div>
        <br />
        <LocationPicker
          location={location} changeLocation={setLocation}
          addressName={addressName} changeAddressName={setAddressName}
          address={address} changeAddress={setAddress}
        />
        <br />
        <br />
        <IonButton onClick={() => {
          if (manualDateError) {
            modalRef.current?.scrollTo(0, 0);
            return
          }
          console.log('create event', { projectId, userId, date, location, addressName, address })
        }}>Create event</IonButton>
      </div>
    </div>
  )
}

const ProjectDay = observer(({ projectId }: Omit<Props, 'userId'>) => {
  return <ProjectDayComponent projectId={projectId} userId={sessionStore.current?.user.id} />
})

export default ProjectDay;
