// import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../app/store"
import { addUserDetails } from "../features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const useAuth = () => {
    const navigate = useNavigate()
    const userData = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()
    
    useEffect(() => {
        const checkAuth =  () => {
            if (!userData.accessToken ||!userData.isLogin) {
                const userSessionData = JSON.parse(sessionStorage.getItem('user') || `{}`)
                if (userSessionData.accessToken) {
                    const { accessToken, refreshToken, id, name, email } = userSessionData
                    dispatch(addUserDetails({ accessToken, refreshToken, userId:id, userName:name, useremail:email,isLogin:true }))
                    navigate('/',{replace:true})
                    
                }else{
                    navigate('/dashboard/auth/login',{replace:true})
                    
                }
            }
            
            
        }
        checkAuth()
    }, [dispatch, navigate, userData.accessToken, userData.isLogin])

    
}

export default useAuth