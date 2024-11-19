import { Routes } from '@generouted/react-router'
import { setupIonicReact } from '@ionic/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { APIProvider } from '@vis.gl/react-google-maps';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@ionic/react/css/core.css';
import './index.css'
import { queryClient } from './queries/queryClient';


setupIonicReact();

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

const root = document.getElementById('root')
if (!root) {
  throw new Error("Missing root element")
}

createRoot(root).render(
  <StrictMode>
    <APIProvider apiKey={API_KEY} libraries={['places']}>
      <QueryClientProvider client={queryClient}>
        <Routes />
      </QueryClientProvider>
    </APIProvider>
  </StrictMode>,
)
