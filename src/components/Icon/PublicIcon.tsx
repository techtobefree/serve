import { IonIcon } from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";

type Props = {
  off?: boolean;
};

export default function PublicIcon({ off }: Props) {
  return (
    <div className="relative group inline-block z-10">
      <IonIcon size="large" icon={off ? eyeOff : eye} />
      <div
        className="
          absolute
          hidden
          group-hover:block
          top-1/2
          right-full
          -translate-y-1/2
          mr-2
          px-2
          py-1
          bg-gray-800
          text-white
          text-sm
          rounded
          whitespace-nowrap
        "
      >
        {`This is${off ? " not" : ""} publicly visible`}
      </div>
    </div>
  );
}
