import { IonIcon, IonImg } from "@ionic/react";
import { person } from "ionicons/icons";
import { useEffect, useState } from "react";

export enum AvatarSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

type Props = {
  src: string;
  alt: string;
  className?: string;
  size: AvatarSize;
}

const sizeMap = {
  [AvatarSize.SMALL]: 'w-[50px] h-[50px]',
  [AvatarSize.MEDIUM]: 'w-[100px] h-[100px]',
  [AvatarSize.LARGE]: 'w-[200px] h-[200px]',
}

export default function Avatar({
  src,
  alt,
  size,
  className
}: Props) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (src) {
      setFailed(false);
    }
  }, [src]);

  const classes = [className, sizeMap[size]].join(' ');

  return (
    <>
      {!failed ? (
        <IonImg
          alt={alt}
          src={src}
          className={classes}
          onIonError={() => { setFailed(true) }}
        />
      ) : (
        <IonIcon icon={person} className={classes} />
      )}
    </>
  )
}
