import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Self-hosted fonts (bundled — no runtime CDN dependency, guaranteed to load).
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'

import './index.css'
import App from './App.jsx'
import ManagerDefineRoute from './routes/ManagerDefineRoute.jsx'
import CandidateInterviewRoute from './routes/CandidateInterviewRoute.jsx'
import StatesIndex from './screens/StatesIndex.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/m/define/:token" element={<ManagerDefineRoute />} />
        <Route path="/i/:token" element={<CandidateInterviewRoute />} />
        <Route path="/states" element={<StatesIndex />} />
        <Route path="/states/:id" element={<StatesIndex />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
