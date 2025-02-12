import { useDispatch } from "react-redux"
// import { RootState } from "../app/store"
import { updateAccessToken } from "../features/auth/authSlice"


const useUpdateAccessToken = (accessToken:string) => {
    // const userState = useSelector((state:RootState)=> state.auth)
    const dispatch = useDispatch()
    
    dispatch(updateAccessToken(accessToken))
    const userSessionData = JSON.parse(sessionStorage.getItem('user') || `{}`)
    userSessionData.accessToken = accessToken
    sessionStorage.removeItem('user')
    sessionStorage.setItem('user',JSON.stringify(userSessionData))
}

export default useUpdateAccessToken