import { House, Package, PackageSearch, ShoppingBasket, Users } from "lucide-react"
import {  NavLink } from "react-router-dom"




const RouteSelect = () => {
   
    
  return (
    <div className="flex flex-col items-center gap-2 ">
        <NavLink to={'/dashboard/'} end //This tells React Router that this route should only be considered active if the URL exactly matches '/dashboard/' and not when it's just a prefix of the current URL
        className={({isActive})=>`flex items-center justify-start w-full gap-2 px-2 py-1 text-sm text-black capitalize rounded shadow bg-stone-200 ${isActive?`bg-white text-stone-950 shadow`:`hover:bg-stone-200 bg-transparent text-stone-500 shadow-none`}`}>
        <House size={16} /> <span className="hidden text-lg md:block">Home</span></NavLink>
        <NavLink to={'/dashboard/product/allProducts'} className={({isActive})=>`flex items-center justify-start w-full gap-2 px-2 py-1 text-sm text-black capitalize rounded shadow bg-stone-200 ${isActive?`bg-white text-stone-950 shadow`:`hover:bg-stone-200 bg-transparent text-stone-500 shadow-none`}`}>
        <Package size={16}/><span className="hidden text-lg md:block">product</span> </NavLink>
        <NavLink to={'/dashboard/user/'} className={({isActive})=>`flex items-center justify-start w-full gap-2 px-2 py-1 text-sm text-black capitalize rounded shadow bg-stone-200 ${isActive?`bg-white text-stone-950 shadow`:`hover:bg-stone-200 bg-transparent text-stone-500 shadow-none`}`}>
        <Users size={16}/> <span className="hidden text-lg md:block">all users</span></NavLink>
        <NavLink to={'/dashboard/order'} className={({isActive})=>`flex items-center justify-start w-full gap-2 px-2 py-1 text-sm text-black capitalize rounded shadow bg-stone-200 ${isActive?`bg-white text-stone-950 shadow`:`hover:bg-stone-200 bg-transparent text-stone-500 shadow-none`}`}>
        <ShoppingBasket size={16}/>
        <span className="hidden text-lg md:block">Orders</span></NavLink>
        <NavLink to={'/dashboard/order/singleOrderByTrackingId'} className={({isActive})=>`flex items-center justify-start w-full gap-2 px-2 py-1 text-sm text-black capitalize rounded shadow bg-stone-200 ${isActive?`bg-white text-stone-950 shadow`:`hover:bg-stone-200 bg-transparent text-stone-500 shadow-none`}`}>
        <PackageSearch size={16}/>
        <span className="hidden text-lg md:block">Find Order</span></NavLink>
    </div>
  )
}

export default RouteSelect
