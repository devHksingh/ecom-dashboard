import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

import DashboardHome from "./components/DashboardHome";
import DashboardLayout from "./layouts/DashboardLayout";
import PageNotFound from "./pages/PageNotFound";
import App from "./App";
import ProductForm from "./pages/ProductForm";
// import FormProduct from "./pages/FormProduct";

// const router = createBrowserRouter([
//     {
//        path:'dashboard',
//        element:<DashboardLayout/>,
//        errorElement:<PageNotFound/>,
//        children:[
//         {
//             path:'',
//             element:<DashboardHome/>
//         },
//         {
//             path:'auth',
        
//         children:[
//             {
//                 path:'/login',
//                 element:<LoginPage/>
//             },
//             {
//                 path:'/register',
//                 element:<RegisterPage/>
//             }
//         ]
//         }
//        ]
//     },
    
// ])
const router = createBrowserRouter([
    {
      path: "dashboard",
      element: <DashboardLayout />,
      
      children: [
        {
          path: "",
          element: <DashboardHome />,

        },
        {
          path: "auth",
          
          children: [
            {
              path: "login", 
              element: <LoginPage />,
            },
            {
              path: "register", 
              element: <RegisterPage />,
            },
            {
              path: "admin/register", 
              element: <RegisterPage />,
            },
            {
              path: "manager/register", 
              element: <RegisterPage />,
            },
            {
                path: "*", // Catch-all route for unmatched paths under "/dashboard/auth"
                element: <PageNotFound />,
            },
          ],
        },
        {
          path:"product",
          children:[
            {
              path:'createProduct',
              element:<ProductForm/>
            },
            // {
            //   path:'createProduct',
            //   element:<FormProduct/>
            // }
          ]
        }
        
      ],
    },
    {
        path:"",
        element:<App/>
    },
    {
        path: "*", 
        element: <PageNotFound />,
    },
  ]);




export default router


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