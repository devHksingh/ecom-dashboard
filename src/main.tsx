import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions:{
    // TODO: Change stale and cache time in production
    queries:{
      staleTime: 40*(60*1000), // 40 mins
      gcTime:15*(60*1000), // 15 mins cacheTime
      refetchIntervalInBackground:true 
    }
  }
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>

        <RouterProvider router={router}/>
      </QueryClientProvider>
      
    </Provider>
    
    
  </StrictMode>,
)
