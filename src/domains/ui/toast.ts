import { observable, runInAction } from "mobx";
import { v4 as uuid } from "uuid";

export type ToastOptions = {
  duration: number;
  isError?: boolean;
};

export type Toast = {
  id: string;
  message: React.ReactNode;
  options: ToastOptions;
  timerId: NodeJS.Timeout;
};

type ToastStore = {
  current: Toast[];
};

export const toastStore = observable<ToastStore>({ current: [] });

export function showToast(
  message: React.ReactNode,
  options: ToastOptions = { duration: 5000 }
) {
  runInAction(() => {
    const id = uuid();

    const timerId = setTimeout(() => {
      runInAction(() => {
        toastStore.current = toastStore.current.filter((t) => t.id !== id);
      });
    }, options.duration);

    toastStore.current.push({ id, message, options, timerId });
  });
}

export function removeToast({ id }: { id: string }) {
  runInAction(() => {
    const toast = toastStore.current.find((t) => t.id === id);

    if (toast) {
      clearTimeout(toast.timerId);
      toastStore.current = toastStore.current.filter((t) => t.id !== id);
    }
  });
}
