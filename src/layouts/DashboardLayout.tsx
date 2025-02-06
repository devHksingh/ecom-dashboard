import { Outlet } from "react-router-dom"
// import DashBoard from "../components/DashBoard/DashBoard"
import SideBar from "../components/SideBar/SideBar"


const DashboardLayout = () => {
  return (
    <div className="grid grid-cols-[13.75rem,_1fr] gap-4 p-4">
        <SideBar/>
        <Outlet/>
        
    </div>
  )
}

export default DashboardLayout