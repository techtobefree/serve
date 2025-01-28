import { IonIcon, IonImg } from "@ionic/react";
import { cube } from "ionicons/icons";
import { useState } from "react";

import { IMAGE_SIZE_MAP, IMAGE_SIZE } from "../../domains/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  size: IMAGE_SIZE;
};

export default function ProjectImage({ src, alt, size, className }: Props) {
  const [failed, setFailed] = useState(false);

  const classes = [IMAGE_SIZE_MAP[size], className].join(" ");

  return (
    <div className={`rounded-xl overflow-hidden`}>
      {!failed ? (
        <IonImg
          alt={alt}
          src={src}
          className={classes}
          onIonError={() => {
            setFailed(true);
          }}
        />
      ) : (
        <IonIcon icon={cube} className={classes} />
      )}
    </div>
  );
}
