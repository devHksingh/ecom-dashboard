import { LogInIcon, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../app/store";
import { logoutUser } from "../../http/api";
import { deleteUser } from "../../features/auth/authSlice";
import { useMutation } from "@tanstack/react-query"

const ThemeToggle = () => {
    const [theme,setTheme]= useState("")
    const [isChecked, setIsChecked] = useState(false)
    const [isLoginUser,setIsLoginUser] = useState(false)
    const userData = useSelector((state:RootState)=> state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationKey:["dashboardLogoutUser"],
        mutationFn:logoutUser,
        onError:()=>{},
        onSuccess:()=>{
          console.log("logout successfully");
          dispatch(deleteUser())
          sessionStorage.clear()
          navigate('/dashboard')
        }
      })
    
      const handleLogoutBtn =()=>{
        mutation.mutate()
      }
    
    useEffect(() => {
        if (userData.isLogin) {
          setIsLoginUser(true);
          
        } else {
          setIsLoginUser(false);
        }
      }, [userData.isLogin]);
    useEffect(()=>{
        // check user prefers-color-scheme 
        const isDrakTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        // console.log(isDrakTheme);
        if(isDrakTheme){
            setTheme("dark")
            localStorage.setItem("theme", "dark");
            document.body.classList.add("dark")
        }else{
            setTheme("light")
            localStorage.setItem("theme", "light");
            document.body.classList.add("light")
        }
    },[])
    
    const handleDarkTheme = ()=>{
    localStorage.setItem("theme","dark")
    setTheme("dark")
    document.body.classList.remove("light")
    document.body.classList.add("dark")

    }
    const handleLightTheme = ()=>{
    localStorage.setItem("theme","light")
    setTheme("light")
    document.body.classList.remove("dark")
    document.body.classList.add("light")
    }
    useHotkeys("ctrl+m",()=>{
    if(theme === "dark"){
        handleLightTheme()
    }else{
        handleDarkTheme()
    }
    })
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
        if(theme === "dark"){
            handleLightTheme()
        }else{
            handleDarkTheme()
        }
      }
  return (
    <div className="sticky top-[calc(100vh_-_48px_-_16px)] text-sm ">
        {
          isLoginUser && (
            <button
            onClick={handleLogoutBtn}
            disabled={mutation.isPending}
            className="flex text-sm items-center gap-2 bg-red-200 transition-colors hover:bg-red-100 hover:text-red-700 px-3 py-1.5 rounded w-full text-center justify-center "
            >
              <span className="capitalize ">logout</span>
              <LogInIcon size={15}/>
            </button>
          )
        }
        
        <div className="flex items-center justify-around gap-1 rounded-md md:gap-2 border-copy-primary">
            <span className="hidden md:inline-block text-copy-primary text-pretty">Theme :</span>
            <span className="hidden capitalize transition-all duration-200 text-copy-primary text-pretty md:inline-block">{theme}</span>
            <div className="flex flex-col items-center gap-2 p-1 py-2 rounded border-copy-primary md:flex-row">
                <label className={` p-1 rounded-md transition-all duration-200 shadow ${theme === "light"?`border bg-cta hover:bg-cta-active`:``}`} >
                    <span><Sun className={`${theme ==="light"?`fill-orange-200 text-orange-200`:`text-stone-600`}`}/></span>
                    <input type="checkbox"  aria-label="light-theme-button" id="" checked={isChecked} onChange={handleCheckboxChange} className="sr-only"/>
                </label>
                <div className="h-6 border border-copy-primary"></div>
                <label className={` p-1 rounded-md transition-all duration-200 shadow ${theme === "dark"?` bg-cta hover:bg-cta-active`:``}`}>
                    <span><Moon strokeWidth={0.5} className={`${theme ==="dark"?`fill-orange-200 text-orange-200`:`text-stone-400`}`}/></span>
                    
                    <input type="checkbox"  aria-label="dark-theme-button" id="" checked={isChecked} onChange={handleCheckboxChange}className="sr-only"/>
                </label>
                
            </div>
        </div>
    </div>
  )
}

export default ThemeToggle
