import { useState } from "react";

import FutureDatePicker from "../Picker.tsx/FutureDatePicker";
import LocationPicker from "../Picker.tsx/LocationPicker";

type Props = {
  projectId: string;
  userId: string;
}

export default function ProjectDay({ projectId, userId }: Props) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  return (
    <div>
      {projectId} {userId}
      <FutureDatePicker value={date} onChange={setDate} />
      <div>
        <LocationPicker value={location} onChange={setLocation} />
      </div>
    </div>
  )
}
