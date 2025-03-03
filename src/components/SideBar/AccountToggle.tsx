import { ChevronsUpDown } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { useEffect, useState } from "react"

const AccountToggle = () => {
  const [isLoginUser,setIsLoginUser] = useState(false)
  const [userName,setUserName] = useState("")
  const [userEmail,setuserEmail] = useState("")
  const userData = useSelector((state:RootState)=>state.auth)
  useEffect(()=>{
    if(userData.isLogin){
      setIsLoginUser(true)
      setUserName(userData.userName)
      setuserEmail(userData.useremail)
    }
  },[])
  
  return (
    <div className="pb-4 mt-2 mb-4 border-b border-stone-300">
         <button className="flex p-0.5 hover:bg-copy-primary/10 rounded transition-colors  gap-2 w-full items-center justify-between">
        <img
          src="https://api.dicebear.com/9.x/notionists/svg"
          alt="avatar"
          className="rounded shadow size-8 shrink-0 bg-violet-500"
        />
        <div className="text-start ml-[-14%]">
          <span className="hidden text-sm font-bold md:block text-copy-primary">{isLoginUser?`${userName}`:"UserName"}</span>
          <span className="hidden text-xs font-medium md:block text-copy-secondary"> {isLoginUser?`${userEmail}`:"Email Id"}</span>
        </div>

        <ChevronsUpDown strokeWidth={1} className="ml-5 text-copy-primary" />
      </button>
    </div>
  )
}

export default AccountToggle  