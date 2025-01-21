import AccountToggle from "./AccountToggle"
import ThemeToggle from "./ThemeToggle"


const SideBar = () => {
  return (
    <div className="">
        <div className="sticky overflow-y-hidden top-4 h-[calc(100vh-32px-48px)]">
            {/* Main side bar content */}
            <AccountToggle/>
        </div>
        {/* Theme toggle */}
        <ThemeToggle/>
    </div>
  )
}

export default SideBar
