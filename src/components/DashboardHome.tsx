import useAuth from "../hooks/useAuth"
import DashBoard from "./DashBoard/DashBoard"
// import SideBar from "./SideBar/SideBar"

const DashboardHome = () => {
  useAuth()
  return (
    // <div className="grid grid-cols-[13.75rem,_1fr] gap-4 p-4">
    //     {/* <SideBar/> */}
        
    // </div>
        <DashBoard/>
  )
}

export default DashboardHome