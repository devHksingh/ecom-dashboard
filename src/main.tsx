import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import DashboardHome from './components/DashboardHome.tsx'
import { RouterProvider } from 'react-router-dom'
import router from './router.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>

        <RouterProvider router={router}/>
      </QueryClientProvider>
      
    </Provider>
    {/* <DashboardHome /> */}
    
  </StrictMode>,
)
