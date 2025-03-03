import { Outlet  } from "react-router-dom"

import SideBar from "../components/SideBar/SideBar"
import useAuth from "../hooks/useAuth"


const DashboardLayout = () => {
  useAuth()
 
    
  return (
    <div className="grid grid-cols-[3.8rem,1fr] md:grid-cols-[13.75rem,_1fr] gap-4 p-4 grid-flow-col-dense">
        <SideBar/>
        <Outlet/>
        
    </div>
  )
}

export default DashboardLayout