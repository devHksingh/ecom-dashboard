import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
// import AuthLayout from "./layouts/AuthLayout";
import DashboardHome from "./components/DashboardHome";
import DashboardLayout from "./layouts/DashboardLayout";



const router = createBrowserRouter([

    {
       path:'dashboard',
       element:<DashboardLayout/>,
       children:[
        {
            path:'',
            element:<DashboardHome/>
        },
        {
            path:'auth',
        // element:<AuthLayout/>,
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
       ]
    },
    // {
    //     path:'/auth',
    //     element:<AuthLayout/>,
    //     children:[
    //         {
    //             path:'login',
    //             element:<LoginPage/>
    //         },
    //         {
    //             path:'register',
    //             element:<RegisterPage/>
    //         }
    //     ]
    // }
])

export default router