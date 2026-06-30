import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Self-hosted fonts (bundled — no runtime CDN dependency, guaranteed to load).
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/600.css'

import './index.css'
import App from './App.jsx'
import ManagerDefineRoute from './routes/ManagerDefineRoute.jsx'
import CandidateInterviewRoute from './routes/CandidateInterviewRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/m/define/:token" element={<ManagerDefineRoute />} />
        <Route path="/i/:token" element={<CandidateInterviewRoute />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
