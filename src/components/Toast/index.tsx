import { IonButton, IonProgressBar } from "@ionic/react";
import { observer } from "mobx-react-lite";

import { useEffect, useMemo, useState } from "react";

import { removeToast, ToastOptions, toastStore, type Toast } from "../../domains/ui/toast";

function ToastProgress({ duration }: { duration: number }) {
  const timeStart = useMemo(() => Date.now(), []);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(() => (Date.now() - timeStart) / duration);
    }, 100);

    return () => { clearInterval(interval) };
  }, [duration, timeStart]);

  return <IonProgressBar value={progress}></IonProgressBar>;
}

function ToastItem({ id, message, options }:
  { id: string, message: React.ReactNode, options: ToastOptions }) {
  if (typeof message === 'string') {
    const classes = ['bg-gray-800 text-gray-200 rounded shadow overflow-hidden']

    if (options.isError) {
      classes.push('bg-red-700 text-white')
    }

    return (
      <div className={classes.join(' ')}>
        <div className='flex'>
          <div className='px-4 py-2'>{message}</div>
          <IonButton onClick={() => { removeToast({ id }) }}>X</IonButton>
        </div>
        <ToastProgress duration={options.duration} />
      </div>
    )
  } else {
    return <>{message}</>
  }
}

type Props = {
  toasts: Toast[];
}

export function ToastComponent({ toasts }: Props) {
  return (
    toasts.length > 0 && (
      <div
        className={`z-50 fixed top-20 flex flex-col gap-2 right-2`}
      >
        {toasts.map(toast => (
          <ToastItem key={toast.id} id={toast.id} message={toast.message} options={toast.options} />
        ))}
      </div>
    )
  )
}

const Toast = observer(() => {
  return (
    <ToastComponent toasts={[...toastStore.current]} />
  )
})

export default Toast;
