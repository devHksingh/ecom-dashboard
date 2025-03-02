import { useEffect, useState } from "react"
import TopBar from "./TopBar"
import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { Link } from "react-router-dom"
import heroImg from '../../assets/Investing 6 (1).svg'

const DashBoard = () => {
  const [isLoginUser,setIsLoginUser] = useState(false)
  // const [userName,setUserName] = useState("")
  const userData = useSelector((state:RootState)=> state.auth)
  useEffect(() => {
      if (userData.isLogin) {
        setIsLoginUser(true);
        // setUserName(userData.userName)
      } else {
        setIsLoginUser(false);
      }
    }, [userData.isLogin, userData.userName]);
  return (
    <div className="h-screen rounded-lg shadow bg-dashboard">
      <TopBar/>
      <div className="container">
        <div className="grid items-center w-full gap-2 mt-6 auto-rows-auto md:grid-cols-2 place-content-between">
          <div className="w-full">
            <h1 className="text-6xl font-medium leading-none">Manage Your <span className="text-indigo-700">Store</span>. </h1>
            <span className="block mt-1 text-6xl font-medium">Grow Your <span className="text-indigo-700">Business</span>.</span>
            <p className="text-xl font-medium opacity-70">Real-time insights and powerful tools to boost your sales and streamline operations.</p>
            {isLoginUser ? (
          <div className="mt-8">
            <Link 
            className="p-1 text-xl rounded-md shadow-md hover:bg-violet-500 hover:text-stone-900 px-3 py-1.5 bg-violet-400"
            to={'/dashboard/product/allProducts'}>View Store Analytics</Link>
          </div>
        ):(
          <div>
            <Link to={'/dashboard/auth/register'} 
            className="text-xl capitalize"
            >
            get started</Link>
          </div>
        )}
          
          </div>
          
          <div className="">
              <img src={heroImg} alt="sdf"/>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default DashBoard