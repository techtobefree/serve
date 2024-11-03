import { useState } from 'react'
import { IonButton } from '@ionic/react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>This is stuff</h1>
      <div className="card">
        <IonButton color="success" fill="solid" onClick={() => { setCount((count) => count + 1) }}>count is {count}</IonButton>
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
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
