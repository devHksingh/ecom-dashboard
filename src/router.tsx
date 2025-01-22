import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./layouts/AuthLayout";



const router = createBrowserRouter([
    {
        path:'/auth',
        element:<AuthLayout/>,
        children:[
            {
                path:'login',
                element:<LoginPage/>
            },
            {
                path:'register',
                element:<RegisterPage/>
            }
        ]
    }
])

export default router