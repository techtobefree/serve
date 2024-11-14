import { Routes } from '@generouted/react-router'
import { setupIonicReact } from '@ionic/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@ionic/react/css/core.css';
import './index.css'
import { queryClient } from './queries/queryClient';

setupIonicReact();

const root = document.getElementById('root')
if (!root) {
  throw new Error("Missing root element")
}
createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  </StrictMode>,
)
