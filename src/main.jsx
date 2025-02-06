import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/all.sass'
import 'bootstrap'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
