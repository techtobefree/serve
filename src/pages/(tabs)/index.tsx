/**
 * Nothing should navigate to this page. This should only ever be reached directly.
 * It is for native apps to have a starting spot to return to, before existing the app.
 */

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
