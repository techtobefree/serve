import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Routes } from '@generouted/react-router'

const root = document.getElementById('root')
if (!root) {
  throw new Error("Missing root element")
}
createRoot(root).render(
  <StrictMode>
    <Routes />
  </StrictMode>,
)
