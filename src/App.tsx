import {  useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './app/store';
// import useAuth from './hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { addUserDetails } from './features/auth/authSlice';


function App() {
  
  const [loading,setLoading] = useState(true)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userData = useSelector((state:RootState)=>state.auth)
  console.log("userData",userData);
  // const isValidUser  = useAuth()
  // console.log(isValidUser)
  
  useEffect(() => {
    const initAuth = async () => {
        try {
            if (userData.isLogin) {
                setLoading(false)
                navigate("/dashboard/product/createProduct")
            } else {
                setLoading(false)
                const userSessionData = JSON.parse(sessionStorage.getItem('user') || `{}`)
                  if (userSessionData.accessToken) {
                      const { accessToken, refreshToken, id, name, email } = userSessionData
                      dispatch(addUserDetails({ accessToken, refreshToken, userId:id, userName:name, useremail:email,isLogin:true }))
                      // TODO: navigate to home dashboard
                      navigate('/', { replace: true })
                      setLoading(false)
                  }else{
                      navigate('/dashboard/auth/login',{replace:true})
                      setLoading(false)
                  }
            }
        } catch (error) {
            console.error('Navigation error:', error)
            setLoading(false)
            navigate("/dashboard/auth/login")
        }
    }

    initAuth()
  }, [dispatch, navigate, userData.isLogin])
  
  
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
