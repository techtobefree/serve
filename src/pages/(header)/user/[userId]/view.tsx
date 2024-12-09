import { IonButton, IonCheckbox, IonIcon, IonImg, IonInput, IonItem, IonLabel } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { observer } from "mobx-react-lite";
import { useState } from "react";

import UploadImage from "../../../../components/UploadImage";
import { sessionStore } from "../../../../domains/auth/sessionStore";
import { getPublicUrl, profilePicturePath } from "../../../../queries/image";
import {
  acceptTerms,
  changeEmail,
  changeHandle,
  changeName,
  useProfileQuery
} from "../../../../queries/profileByUserId";
import { useNavigate, useParams } from "../../../../router"

type Props = {
  canEdit?: boolean;
  userId: string;
  initial?: boolean;
}

export function UserView({ canEdit, userId, initial }: Props) {
  const { data: user, isLoading } = useProfileQuery(userId);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [profilePicture, setProfilePicture] = useState(getPublicUrl(profilePicturePath(userId)));
  const [tempBase64Image, setTempBase64Image] = useState<string | null>(null);
  const navigate = useNavigate();

  if (isLoading || !user) {
    return <div>Loading...</div>
  }

  if (canEdit) {
    return (
      <div className="flex w-full justify-center overflow-auto">
        <div className="max-w-[800px] w-full p-2 flex flex-col gap-6">
          <div>
            <IonIcon className='cursor-pointer text-4xl'
              icon={arrowBack} onClick={() => { navigate('/track') }} />
          </div>
          {initial && (
            <div className='pb-4 pt-4'>
              We require you to fill out your profile to continue.
              Once the required fields are filled out, you will be taken back to where you were.
              Edit any time by expanding the profile icon in the top left corner.
            </div>
          )}
          <div className='flex flex-col gap-4'>
            <div className='text-3xl'>
              Profile
            </div>
            <div className='flex flex-col'>
              <IonImg src={tempBase64Image || profilePicture}
                alt="Picture" className='w-[200px] h-[200px] self-center' />
              {!isEditingPhoto && (
                <IonButton color='secondary'
                  className='flex pb-4'
                  onClick={() => { setIsEditingPhoto(true) }}>
                  Change picture
                </IonButton>
              )}
              {isEditingPhoto && (
                <UploadImage path={profilePicturePath(userId)}
                  onChange={image => { setTempBase64Image(image) }}
                  close={() => {
                    setProfilePicture(
                      `${getPublicUrl(profilePicturePath(userId))}?
                      ${new Date().getTime().toString()}`)
                    setIsEditingPhoto(false)
                  }} />
              )}
            </div>
            <IonItem>
              <IonInput label='Public name*'
                value={user.handle}
                onIonChange={(e) => { void changeHandle(userId, e.detail.value) }}
              />
            </IonItem>
            <IonItem>
              <IonInput label='First name*'
                value={user.sensitive_profile[0]?.first_name}
                onIonChange={(e) => { void changeName(userId, { firstName: e.detail.value }) }}
              />
            </IonItem>
            <IonItem>
              <IonInput label='Last name*'
                value={user.sensitive_profile[0]?.last_name}
                onIonChange={(e) => { void changeName(userId, { lastName: e.detail.value }) }}
              />
            </IonItem>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='text-3xl'>
              Contact
            </div>
            <IonItem>
              <IonInput label='Email*'
                value={user.sensitive_profile[0]?.email}
                onIonChange={(e) => { void changeEmail(userId, e.detail.value) }}
              />
            </IonItem>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='text-3xl'>
              Terms and conditions
            </div>
            <div>
              First name, last name, and email address will be shared with your project leaders.
            </div>
            <div>
              By using the app you agree to our {' '}
              <a className='underline cursor-pointer color-blue'
                href='https://servetobefree.org/privacy-policy'
                target="_blank" rel="noreferrer">
                privacy policy
              </a>.
            </div>
            <IonItem onClick={() => {
              void acceptTerms(userId, !user.sensitive_profile[0]?.accepted_terms)
            }}>
              <IonLabel>I accept terms and conditions*</IonLabel>
              <IonCheckbox
                checked={!!user.sensitive_profile[0]?.accepted_terms}
                onIonChange={(e) => {
                  void acceptTerms(userId, e.target.checked)
                }}
              />
            </IonItem>
          </div>
          {initial && (
            <IonButton className='p-4 self-end'>Continue</IonButton>
          )}
          <br />
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full justify-center">
      <div className="max-w-[800px] w-full p-2">
        <div>
          <IonIcon className='cursor-pointer text-4xl'
            icon={arrowBack} onClick={() => { navigate('/track') }} />
        </div>
        <div>
          <div className='text-3xl'>
            Profile
          </div>
          <div>Public name: {user.handle}</div>
          <div>First name: {user.sensitive_profile[0]?.first_name}</div>
          <div>Last name: {user.sensitive_profile[0]?.last_name}</div>
        </div>
        <div>
          <div className='text-3xl'>
            Contact
          </div>
          <div>Email: {user.sensitive_profile[0]?.email}</div>
        </div>
      </div>
    </div>
  )
}

export const UserViewPage = observer(() => {
  const { userId } = useParams('/user/:userId/view')
  const currentUserId = sessionStore.current?.user.id;

  return (
    <UserView userId={userId} canEdit={userId === currentUserId} />
  )
});

export default UserViewPage;
