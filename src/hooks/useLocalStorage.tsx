import { useEffect, useState } from "react";

export function useLocalStorage(key: string) {
  const [local, setLocal] = useState<string>("")

  useEffect(() => {
    const current = localStorage.getItem(key)
    if (current) {
      setLocal(current)
    }
  }, [key])

  return [
    local,
    (newValue: string) => {
      localStorage.setItem(key, newValue);
      setLocal(newValue);
    }
  ] as [string, (newValue: string) => void]
}
