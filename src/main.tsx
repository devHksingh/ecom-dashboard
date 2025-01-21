import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DashboardHome from './components/DashboardHome.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DashboardHome />
    
  </StrictMode>,
)
