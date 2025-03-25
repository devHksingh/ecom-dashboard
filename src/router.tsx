import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

import DashboardHome from "./components/DashboardHome";
import DashboardLayout from "./layouts/DashboardLayout";
import PageNotFound from "./pages/PageNotFound";
import App from "./App";
import ProductForm from "./pages/ProductForm";
import ProductTable from "./pages/ProductTable";
import SingleProductPage from "./pages/SingleProductPage";
import ProductEditForm from "./pages/ProductEditForm";
import UsersTable from "./pages/UsersTable";
import OrderTable from "./pages/OrderTable";
import SingleOrderPage from "./pages/SingleOrderPage";
import GetOrderByTrackingId from "./pages/GetOrderByTrackingId";
import UserProfile from "./pages/UserProfile";
import ChangePassword from "./pages/ChangePassword";
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
              path:'allProducts',
              element:<ProductTable/>
            },
            {
              path:'createProduct',
              element:<ProductForm/>
            },
            {
              path:`singleProduct/:id`,
              element:<SingleProductPage/>
            },
            {
              path:`editProduct/:id`,
              element:<ProductEditForm/>
            }
          ]
        },
        {
          path:'user',
          children:[
            {
              path:'',
              element:<UsersTable/>
            }
          ]
        },{
          path:'order',
          children:[
            {
              path:'',
              element:<OrderTable/>
            },
            {
              path:`singleOrder/:id`,
              element:<SingleOrderPage/>
            },
            {
              path:'singleOrderByTrackingId',
              element:<GetOrderByTrackingId/>
            }
          ]
        },
        {
          path:"userProfile",
          children:[
            {
              path:"",
              element:<UserProfile/>
            },
            {
              path:"changePassword",
              element:<ChangePassword/>
            },

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
