import { IonItem, IonLabel } from "@ionic/react";

import { Address } from "../../domains/map/addressComponents";

type Props = {
  address: Address;
  onChange: (address: Address) => void;
  name: string;
  changeName: (name: string) => void;
}

export default function AddressInput({ address, onChange, name, changeName }: Props) {
  return (
    <div className="max-w-[400px]">
      <IonItem>
        <IonLabel>Name</IonLabel>
        <input type='text'
          className='w-[300px]'
          value={name}
          onChange={(e) => { changeName(e.target.value) }}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Street</IonLabel>
        <input type='text'
          className='w-[300px]'
          value={address.street}
          onChange={(e) => { onChange({ ...address, street: e.target.value }) }}
        />
      </IonItem>
      <IonItem>
        <IonLabel>City</IonLabel>
        <input type='text'
          className='w-[300px]'
          value={address.city}
          onChange={(e) => { onChange({ ...address, city: e.target.value }) }}
        />
      </IonItem>
      <IonItem>
        <IonLabel>State</IonLabel>
        <input type='text'
          className='w-[300px]'
          value={address.state}
          onChange={(e) => { onChange({ ...address, state: e.target.value }) }}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Zip</IonLabel>
        <input type='text'
          className='w-[300px]'
          value={address.zip}
          onChange={(e) => { onChange({ ...address, zip: e.target.value }) }}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Country</IonLabel>
        <input type='text'
          className='w-[300px]'
          value={address.country}
          onChange={(e) => { onChange({ ...address, country: e.target.value }) }}
        />
      </IonItem>
    </div>
  )
}
