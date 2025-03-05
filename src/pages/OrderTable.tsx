import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { forcedLogout, getAllOrders } from "../http/api"
import { useDispatch } from "react-redux"
// import { RootState } from "../app/store"
import { deleteUser, updateAccessToken } from "../features/auth/authSlice"
import TableLoader from "../components/skeleton/TableLoader"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"

interface ErrorResponse {
    message: string;
  }

const OrderTable = () => {
    const [limit,setLimit]= useState(5)
    const [skip,setSkip]= useState(0)
    const [orderData,setOrderData]= useState(null)
    const [past30DaysOrders,setPast30DaysOrders]= useState(null)
    const [top5MostBought,setTop5MostBought]= useState(null)
    const [top5LeastBought,setTop5LeastBought]= useState(null)
    
    // redux 
    // const userData = useSelector((state:RootState)=>state.auth)
    const dispatch = useDispatch()

    // react router dom
    const navigate = useNavigate()

    const {data,isError,isLoading,error} = useQuery({
        queryKey:["getAllOrder",limit,skip],
        queryFn:()=>getAllOrders(limit,skip)
    })
    // mutation query for forced logout user in case of error (in case of access token not found)
    const mutation = useMutation({
        mutationKey:["logoutUser"],
        mutationFn:forcedLogout,
        onSuccess:()=>{
          dispatch(deleteUser())
          sessionStorage.removeItem('user')
          navigate('/dashboard/auth/login')
        }
      })
    useEffect(()=>{
        if(data){
            // accessToken
            if(data.isAccessTokenExp){
                
                dispatch(updateAccessToken(data.accessToken))
            }
            console.log(data);
            setOrderData(data.totalOrdersArr)
            setPast30DaysOrders(data.past30DaysOrders)
            setTop5MostBought(data.top5MostBought)
            setTop5LeastBought(top5LeastBought)
        }
    },[data, dispatch, top5LeastBought])
    if (isError) {
        const axiosError = error as AxiosError<ErrorResponse>; 
        const errorMessage =
          axiosError.response?.data?.message || "Something went wrong!.Error loading user details. Please try again later.Or refresh the page";
        
        if(axiosError.status === (401 )){
            console.error("axiosError:", axiosError.status);
            
            mutation.mutate()
            
        }
        return (
          <div className="p-4 text-4xl font-bold text-center text-red-600 bg-red-100 rounded-md">
            { errorMessage }
          </div>
        );
      }
    
    if ( isLoading ) {
        return <TableLoader />;
      }
    
    
  return (
    <div>OrderTable</div>
  )
}

export default OrderTable