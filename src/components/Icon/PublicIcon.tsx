import { IonIcon } from "@ionic/react";
import { eye } from "ionicons/icons";

export default function PublicIcon() {
  return <div className="relative group inline-block z-10">
    <IonIcon size="large" icon={eye} />
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
      This is publicly visible
    </div>
  </div>
}