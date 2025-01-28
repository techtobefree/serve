import { IonIcon, IonImg } from "@ionic/react";
import { person } from "ionicons/icons";
import { useEffect, useState } from "react";

import { IMAGE_SIZE, IMAGE_SIZE_MAP } from "../../domains/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  size: IMAGE_SIZE;
};

export default function Avatar({ src, alt, size, className }: Props) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (src) {
      setFailed(false);
    }
  }, [src]);

  const classes = [IMAGE_SIZE_MAP[size], className].join(" ");

  return (
    <div className="overflow-hidden">
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
        <IonIcon icon={person} className={classes} />
      )}
    </div>
  );
}
