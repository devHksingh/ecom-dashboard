import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DashboardHome from './components/DashboardHome.tsx'
import { RouterProvider } from 'react-router-dom'
import router from './router.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
    <DashboardHome />
    
  </StrictMode>,
)
