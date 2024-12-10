import { IonIcon, IonImg } from "@ionic/react";
import { cube } from "ionicons/icons";
import { useState } from "react";

export enum ProjectImageSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

type Props = {
  src: string;
  alt: string;
  className?: string;
  size: ProjectImageSize;
}

const sizeMap = {
  [ProjectImageSize.SMALL]: 'w-[128px] h-[128px]',
  [ProjectImageSize.MEDIUM]: 'w-[300px] h-[200px]',
  [ProjectImageSize.LARGE]: 'w-[400px] h-[300px]',
}

export default function ProjectImage({
  src,
  alt,
  size,
  className
}: Props) {
  const [failed, setFailed] = useState(false);

  const classes = [sizeMap[size], className].join(' ');

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
        <IonIcon icon={cube} className={classes} />
      )}
    </>
  )
}
