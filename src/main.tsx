import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import DashboardHome from './components/DashboardHome.tsx'
import { RouterProvider } from 'react-router-dom'
import router from './router.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>

      <RouterProvider router={router}/>
    </Provider>
    {/* <DashboardHome /> */}
    
  </StrictMode>,
)
