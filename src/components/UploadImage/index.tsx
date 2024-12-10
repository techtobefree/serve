import { Camera, CameraDirection, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonButton, IonIcon, IonImg, IonLoading } from "@ionic/react";
import { cameraOutline, closeOutline, cloudUpload, cube } from 'ionicons/icons';
import { useState } from "react";

import { uploadImage } from '../../queries/image';

type Props = {
  path: string;
  src?: string;
  onChange?: (image: string) => void;
  close: () => void;
}

export default function UploadImage({ path, onChange, close, src }: Props) {
  const [base64Image, setBase64Image] = useState<string | null>(null); // Base64 image preview
  const [uploading, setUploading] = useState(false);
  const [failed, setFailed] = useState(false);

  const captureImage = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Base64, // Get image as base64
        quality: 90,
        direction: CameraDirection.Front,
        source: CameraSource.Camera,
        width: 100,
        height: 100,
        correctOrientation: true,
      });
      const base64Data = `data:image/jpeg;base64,${photo.base64String as string}`;
      if (onChange) {
        onChange(base64Data);
      }
      setBase64Image(base64Data);
      setFailed(false);
    } catch (error) {
      console.error('Error capturing image:', error);
    }
    console.log('Image captured', base64Image);
  };

  return (
    <div className='flex flex-col items-center w-full'>
      {!onChange && (
        !failed ? (
          <IonImg src={base64Image || src || ''} alt="Picture"
            onIonError={() => { setFailed(true) }}
            className='w-[200px] h-[200px] self-center' />
        ) : (
          <IonIcon icon={cube} className={'w-[200px] h-[200px] self-center'} />
        )
      )}
      <div className='flex'>
        <IonButton color="secondary" onClick={() => { void captureImage() }}>
          <IonIcon className='pr-4' size='large' icon={cameraOutline} />
          Add Image
        </IonButton>
        <IonButton disabled={!base64Image}
          onClick={(async () => {
            if (base64Image) {
              setUploading(true)
              await uploadImage(path, base64Image)
              setUploading(false)
              close();
            }
          }) as () => void}
          color="secondary">
          <IonIcon className='pr-4' size='large' icon={cloudUpload} />
          Save
        </IonButton>
        <IonButton disabled={!base64Image && !onChange}
          color="danger" onClick={() => { setBase64Image(null); close(); }}>
          <IonIcon size='large' icon={closeOutline} />
        </IonButton>
      </div>

      <IonLoading isOpen={uploading} message="Uploading image..." />
    </div>
  )
}