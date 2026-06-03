import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './auth/AuthProvider.tsx'
import './index.css'
import App from './App.tsx'

import {BrowserRouter} from "react-router"

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>
  </AuthProvider>,
)
