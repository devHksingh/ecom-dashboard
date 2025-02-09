import { useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { RootState } from "../app/store"

const AuthLayout = () => {
  const navigate = useNavigate()
  useAuth()
  const userData = useSelector((state:RootState)=> state.auth)
  if(userData.isLogin && userData.accessToken){
    navigate('/dashboard/product/createProduct')
  }
  return (
    <>
        <Outlet/>
    </>
  )
}

export default AuthLayout