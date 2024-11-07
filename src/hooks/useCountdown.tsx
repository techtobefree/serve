import { useEffect, useState } from "react";

function findRemainder(endTime: number) {
  const remaingTime = endTime - Date.now();
  if (remaingTime <= 0) {
    return 0
  }
  return remaingTime
}

export function useCountdown(endTime: number = 0, interval: number = 1000) {
  const [currentEndTime, setEndtime] = useState<number>(endTime);
  const [remainder, setRemainder] = useState(findRemainder(currentEndTime));

  useEffect(() => {
    if (currentEndTime > 0) {
      const initialRemainder = findRemainder(currentEndTime);
      if (!initialRemainder) {
        return
      }

      setRemainder(initialRemainder)

      const intervalId = setInterval(() => {
        const newRemainder = findRemainder(currentEndTime)
        setRemainder(newRemainder)
        if (!newRemainder) {
          clearInterval(intervalId)
        }
      }, interval)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [currentEndTime, interval])

  return [remainder, (delay: number) => {
    setEndtime(Date.now() + delay)
  }] as [number, (delay: number) => void]
}
