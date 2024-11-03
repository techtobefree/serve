import { IonButton } from "@ionic/react"
import { useState } from "react"

export default function Projects() {
  const [count, setCount] = useState(0)

  return (
    <IonButton color="success" fill="solid" onClick={() => { setCount((count) => count + 1) }}>count is {count}</IonButton>
  )
}
