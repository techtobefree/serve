import { IonButton } from "@ionic/react"
import { useState } from "react"

export default function Projects() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <IonButton color="success" fill="solid" onClick={() => { setCount((count) => count + 1) }}>count is {count}</IonButton>
      <div className="card">
        <p>
          Edit <code>src/pages/index.tsx</code> and save to test HMR
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          More stuff
          <br />
          <br />
          <br />
          <br />
          <br />
          More stuff
          <br />
          <br />
          <br />
          <br />
          More stuff
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          More stuff
        </p>
      </div>
    </div>
  )
}
