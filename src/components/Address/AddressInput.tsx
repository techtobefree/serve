import { IonInput, IonItem } from "@ionic/react";

import { Address } from "../../domains/address/addressComponents";

type Props = {
  address: Address;
  onChange: (address: Address) => void;
  name: string;
  changeName: (name: string) => void;
}

export default function AddressInput({ address, onChange, name, changeName }: Props) {
  return (
    <div className="w-full">
      <IonItem>
        <IonInput label='Name'
          labelPlacement="fixed"
          value={name}
          onIonChange={(e) => { changeName(e.detail.value || '') }}
        />
      </IonItem>
      <IonItem>
        <IonInput label='Street'
          labelPlacement="fixed"
          value={address.street}
          onIonChange={(e) => { onChange({ ...address, street: e.detail.value || '' }) }}
        />
      </IonItem>
      <IonItem>
        <IonInput label='City'
          labelPlacement="fixed"
          value={address.city}
          onIonChange={(e) => { onChange({ ...address, city: e.detail.value || '' }) }}
        />
      </IonItem>
      <IonItem>
        <IonInput label='State'
          labelPlacement="fixed"
          value={address.state}
          onIonChange={(e) => { onChange({ ...address, state: e.detail.value || '' }) }}
        />
      </IonItem>
      <IonItem>
        <IonInput label='Postal Code'
          labelPlacement="fixed"
          value={address.postalCode}
          onIonChange={(e) => { onChange({ ...address, postalCode: e.detail.value || '' }) }}
        />
      </IonItem>
      <IonItem>
        <IonInput label='Country'
          labelPlacement="fixed"
          value={address.country}
          onIonChange={(e) => { onChange({ ...address, country: e.detail.value || '' }) }}
        />
      </IonItem>
    </div>
  )
}
