import {  LogInIcon, UserRoundPlus } from "lucide-react"
import usegetFullDate from "../../hooks/usegetFullDate"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { logoutUser } from "../../http/api"
import { deleteUser } from "../../features/auth/authSlice"
import { useNavigate } from "react-router-dom"


const TopBar = () => {
  const [isLoginUser,setIsLoginUser] = useState(false)
  const [userName,setUserName] = useState("")
  const {fullDate,time,text} = usegetFullDate()
  const userData = useSelector((state:RootState)=> state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const sessionData = sessionStorage.get("user")
  
  
  useEffect(() => {
    if (userData.isLogin) {
      setIsLoginUser(true);
      setUserName(userData.userName)
    } else {
      setIsLoginUser(false);
    }
  }, [userData.isLogin, userData.userName]);
  
  

  const mutation = useMutation({
    mutationKey:["logoutUser"],
    mutationFn:logoutUser,
    onError:()=>{},
    onSuccess:()=>{
      console.log("logout successfully");
      dispatch(deleteUser())
      sessionStorage.clear()
      setUserName("") 
    }
  })

  const handleLogoutBtn =()=>{
    mutation.mutate()
  }

  const handleLogin = ()=>{
    navigate('/auth/login')
  }
  const handleSignUp = ()=>{
    navigate('/auth/register')
  }
  
  return (
    <div className="px-4 pb-4 mt-2 mb-4 border-b border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="block text-sm font-bold capitalize">🚀 Good {text}, {isLoginUser?`${userName}`:'User!'}</span>
          <span className="block pl-5 mt-1 text-xs text-copy-primary/70">
            {`${fullDate}, ${time}`}
          </span>
        </div>

        {
          !isLoginUser &&(
            <div className="flex gap-4">
              <button
              onClick={handleLogin}
              className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded"
              ><span className="capitalize ">login</span> <LogInIcon size={15}/></button>
              <button
              onClick={handleSignUp}
              className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded"
              >SignUp <UserRoundPlus size={15}/></button>
            </div>
          )
        }
        
        {
          isLoginUser && (
            <button
            onClick={handleLogoutBtn}
            disabled={mutation.isPending}
            className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded"
            >
              <span className="capitalize ">logout</span>
              <LogInIcon size={15}/>
            </button>
          )
        }

        
      </div>
    </div>
  )
}

export default TopBar