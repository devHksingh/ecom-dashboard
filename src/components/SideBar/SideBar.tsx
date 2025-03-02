import AccountToggle from "./AccountToggle"
import RouteSelect from "./RouteSelect"
import ThemeToggle from "./ThemeToggle"


const SideBar = () => {
  return (
    <div className="">
        <div className="sticky overflow-y-hidden top-4 h-[calc(100vh-32px-48px)]">
            {/* Main side bar content */}
            <AccountToggle/>
            <RouteSelect/>
        </div>
        {/* Theme toggle */}
        <ThemeToggle/>
    </div>
  )
}

export default SideBar
