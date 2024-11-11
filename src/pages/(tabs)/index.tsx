import { useEffect } from "react";
import Home from "./home";
import { shouldReplaceHistory } from "../../domains/ui/navigation";

export default function App() {
  useEffect(() => {
    shouldReplaceHistory(false)
    return () => {
      shouldReplaceHistory(true)
    }
  }, [])

  return (
    <Home />
  )
}
