import DashBoard from "./DashBoard/DashBoard"
import SideBar from "./SideBar/SideBar"

const DashboardHome = () => {
  return (
    <div className="grid grid-cols-[13.75rem,_1fr] gap-4 p-4">
        <SideBar/>
        <DashBoard/>
        
    </div>
  )
}

export default DashboardHome