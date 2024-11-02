import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes } from '@generouted/react-router'
import './index.css'
import '@ionic/react/css/core.css';
import { setupIonicReact } from '@ionic/react';

setupIonicReact();

const root = document.getElementById('root')
if (!root) {
  throw new Error("Missing root element")
}
createRoot(root).render(
  <StrictMode>
    <Routes />
  </StrictMode>,
)
