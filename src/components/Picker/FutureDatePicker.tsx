import { IonDatetime } from "@ionic/react";
import { addYears, format } from "date-fns";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function DatePicker({ value, onChange }: Props) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <IonDatetime
      presentation="date"
      value={value}
      onIonChange={(e) => {
        onChange(e.detail.value as string);
      }}
      min={today}
      max={format(addYears(today, 2), "yyyy-MM-dd")}
    />
  );
}
