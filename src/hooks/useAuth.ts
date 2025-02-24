import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../app/store"
import { addUserDetails } from "../features/auth/authSlice"
import { useNavigate } from "react-router-dom"

const useAuth = () => {
    const navigate = useNavigate()
    const userData = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()
    useEffect(() => {
        const checkAuth = async () => {
            if (!userData.accessToken ||!userData.isLogin) {
                const userSessionData = JSON.parse(sessionStorage.getItem('user') || `{}`)
                if (userSessionData.accessToken) {
                    const { accessToken, refreshToken, id, name, email } = userSessionData
                    dispatch(addUserDetails({ accessToken, refreshToken, id, name, email }))
                    // navigate('/dashboard/product/createProduct', { replace: true })
                    return
                }else{
                    navigate('/dashboard/auth/login',{replace:true})
                    return
                }
            }
            // navigate('/dashboard/product/createProduct', { replace: true })
            return
        }
        checkAuth()
    }, [dispatch, navigate, userData.isLogin])

    
}

export default useAuth