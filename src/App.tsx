import {  useEffect, useState } from 'react'

import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import useAuth from './hooks/useAuth';
import { useNavigate } from 'react-router-dom';


function App() {
  
  const [loading,setLoading] = useState(true)
  const navigate = useNavigate()
  
  const userData = useSelector((state:RootState)=>state.auth)
  console.log("userData",userData);
  const isValidUser  = useAuth()
  console.log(isValidUser)
  
  useEffect(() => {
    const initAuth = async () => {
        try {
            if (userData.isLogin) {
                setLoading(false)
                navigate("/dashboard/product/createProduct")
            } else {
                setLoading(false)
                navigate("/dashboard/auth/login")
            }
        } catch (error) {
            console.error('Navigation error:', error)
            setLoading(false)
            navigate("/dashboard/auth/login")
        }
    }

    initAuth()
}, [ navigate, userData.isLogin])
  
  
  return (
    <div className='flex items-center justify-center h-screen bg-gradient-to-br from-blue-700 to-purple-700 text-stone-200'>
    {
      loading && 
      <div className='flex items-center justify-center gap-2'>
        <span className='text-6xl animate-pulse'>Loading</span>
        <span className='flex animate-pulse'>
        <span className='self-end text-6xl font-bold animate-bounce' style={{animationDelay:"0s"}}>.</span>
        <span className='self-end text-6xl font-bold animate-bounce' style={{animationDelay:"0.2s"}}>.</span>
        <span className='self-end text-6xl font-bold animate-bounce' style={{animationDelay:"0.4s"}}>.</span>
        </span>
      </div>
    }
    </div>
  )
}



export default App
