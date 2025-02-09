import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../app/store"
import { addUserDetails } from "../features/auth/authSlice"

const useAuth = () => {
    
    const userData = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        if (userData.isLogin === false) {
            const userSessionData = JSON.parse(sessionStorage.getItem('user') || '{}')
            if (userSessionData.accessToken) {
                const { accessToken, refreshToken, id, name, email } = userSessionData
                dispatch(addUserDetails({
                    isLogin: true,
                    accessToken,
                    refreshToken,
                    userId: id,
                    useremail: email,
                    userName: name
                }))
                
            }
        } 
    }, [userData.isLogin, dispatch])

     
}

export default useAuth
/*
    check user auth data is present in state || session
    
    if session have userData then update user state
    and return userState
    if not return isLogin status
    */