import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { forcedLogout, getAllOrders, getgraphData } from "../http/api"
import { useDispatch } from "react-redux"
// import { RootState } from "../app/store"
import { deleteUser, updateAccessToken } from "../features/auth/authSlice"
import TableLoader from "../components/skeleton/TableLoader"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  
  BarChart,
  Legend,
  Bar,
//   Legend,
} from "recharts";
import { User2Icon } from "lucide-react"

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
    const [graphData,setGraphData] = useState(null)
    const [year,setYear] = useState(2025)
    
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
    const {data:orderGraphData,isLoading:graphDataLoading} = useQuery({
      queryKey:["orderGraphData",year],
      queryFn:()=>getgraphData(year),
      
    })

    // set graph data
    useEffect(()=>{
      if(orderGraphData){
        console.log("orderGraphData.graphDataArr",orderGraphData.graphDataArr)
        setGraphData(orderGraphData.graphDataArr)
      }
    },[orderGraphData])
    
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
    
    if ( isLoading || graphDataLoading ) {
        return <TableLoader />;
    }
    
    console.log("graphData",graphData);
    
  return (
    <div className="container grid w-full grid-cols-1 p-2 bg-dashboard/50">
        <div className="p-6 w-[90%] bg-card/75 text-copy-primary md:w-[96%] mx-auto rounded-md">
            <h1 className="pb-4 mb-6 text-2xl font-bold text-center border-b-2 border-b-stone-600">
                OrdersTable
            </h1>
            {/* TOP SECTION */}
            
            {/* grid */}
            <div className="grid gap-4 auto-rows-min md:grid-cols-3">
              <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                <h2 className="flex justify-between w-full font-semibold capitalize text-md">Total sale Amount: <span><User2Icon size={14}/></span></h2>
                <span className="font-mono text-4xl font-bold">{data.totalSaleAmount}</span>
              </div>
              <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                <h2 className="flex justify-between w-full font-semibold text-md">Number of order last 30 days: <span ><User2Icon size={14} /></span></h2>
                <span className="font-mono text-4xl font-bold">{data.totalOrders}</span>
                <span className="text-sm font-medium text-copy-primary/70 text-pretty">+{data.past30DaysOrders.length} from last month</span>
              </div>
              <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                <h2 className="flex justify-between w-full font-semibold capitalize text-md">Top 5 most bought orders: <span><User2Icon size={14}/></span></h2>
                <span className="flex flex-col items-center justify-between md:flex-row">{data.top5MostBought.map((item,index:number)=>(
              <div key={index} className="relative self-center cursor-pointer group">
                {/* <div className="flex flex-col gap-1 text-sm font-thin">
                  <span>{item.name}</span>
                  <span>{item.value.price}</span>
                </div> */}
                <div className="p-1 rounded-lg bg-zinc-50">
                  <img src={item.value.url} alt={item.name} className="object-cover h-20 rounded-lg w-18"/>
                  <span className="absolute top-0 p-1 mx-auto text-xs scale-0 rounded text-stone-200 bg-stone-900 group-hover:scale-100">{item.name}</span>
                </div>
              </div>
            ))}</span>
                {/* <span className="text-sm font-medium text-copy-primary/70 text-pretty">+{data.lastThirtyDaysUserCount.usersAdded} from last month</span> */}
              </div>
              <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                <h2 className="flex justify-between w-full font-semibold text-md">top 5 Most Expensive Orders:: <span><User2Icon size={14}/></span></h2>
                <span className="flex flex-col items-center justify-between gap-2 md:flex-row">{data.top5MostExpensiveOrders.map((item,index:number)=>(
              <div key={index} className="relative self-center cursor-pointer group">
                {/* <div className="flex flex-col gap-1 text-sm font-thin">
                  <span>{item.name}</span>
                  <span>{item.value.price}</span>
                </div> */}
                <div className="p-1 rounded-lg bg-zinc-50">
                  <img src={item.productDetail.imageUrl} alt={item.productDetail.name} className="object-cover h-20 rounded-lg w-18"/>
                  <span className="absolute top-0 p-1 text-xs scale-0 rounded text-stone-200 bg-stone-900 group-hover:scale-100">{item.productDetail.name}</span>
                </div>
              </div>
            ))}</span>
                {/* <span className="text-sm font-medium text-copy-primary/70 text-pretty">+{data.lastThirtyDaysUserCount.usersAdded} from last month</span> */}
              </div>
              <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                <h2 className="flex justify-between w-full font-semibold capitalize text-md">top 5 Least Expensive Orders: <span><User2Icon size={14}/></span></h2>
                <span className="flex flex-col items-center justify-between gap-2 md:flex-row">{data.top5LeastExpensiveOrders.map((item,index:number)=>(
              <div key={index} className="relative self-center cursor-pointer group">
                {/* <div className="flex flex-col gap-1 text-sm font-thin">
                  <span>{item.name}</span>
                  <span>{item.value.price}</span>
                </div> */}
                <div className="p-1 rounded-lg bg-zinc-50">
                  <img src={item.productDetail.imageUrl} alt={item.productDetail.name} className="object-cover h-20 rounded-lg w-18"/>
                  <span className="absolute top-0 p-1 text-xs scale-0 rounded text-stone-200 bg-stone-900 group-hover:scale-100">{item.productDetail.name}</span>
                </div>
              </div>
            ))}</span>
                {/* <span className="text-sm font-medium text-copy-primary/70 text-pretty">+{data.lastThirtyDaysUserCount.usersAdded} from last month</span> */}
              </div>
              <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                <h2 className="flex justify-between w-full font-semibold capitalize text-md">top 5 Least Bought: <span><User2Icon size={14}/></span></h2>
                <span className="flex flex-col items-center justify-between gap-2 md:flex-row">{data.top5LeastBought.map((item,index:number)=>(
              <div key={index} className="relative self-center cursor-pointer group">
                {/* <div className="flex flex-col gap-1 text-sm font-thin">
                  <span>{item.name}</span>
                  <span>{item.value.price}</span>
                </div> */}
                <div className="p-1 rounded-lg bg-zinc-50">
                  <img src={item.value.url} alt={item.name} className="object-cover h-20 rounded-lg w-18"/>
                  <span className="absolute top-0 p-1 text-xs scale-0 rounded text-stone-200 bg-stone-900 group-hover:scale-100">{item.name}</span>
                </div>
              </div>
            ))}</span>
                {/* <span className="text-sm font-medium text-copy-primary/70 text-pretty">+{data.lastThirtyDaysUserCount.usersAdded} from last month</span> */}
              </div>
              {/*  */}
                <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                  <h2 className="flex justify-between w-full font-semibold capitalize text-md">Number of order  processed: <span><User2Icon size={14}/></span></h2>
                  <span className="font-mono text-4xl font-bold">{data.productOrderStatusCount.processed}</span>
                </div>
                <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                  <h2 className="flex justify-between w-full font-semibold capitalize text-md">Number of order  delivered: <span><User2Icon size={14}/></span></h2>
                  <span className="font-mono text-4xl font-bold">{data.productOrderStatusCount.delivered}</span>
                </div>
                <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                  <h2 className="flex justify-between w-full font-semibold capitalize text-md">Number of order  shipped: <span><User2Icon size={14}/></span></h2>
                  <span className="font-mono text-4xl font-bold">{data.productOrderStatusCount.shipped}</span>
                </div>
              </div>
            {/* <div className="grid md:grid-cols-3">
              <div className="flex flex-col col-span-2 gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                  <h2 className="flex justify-between w-full font-semibold text-md">Top 5 most bought orders: <span><User2Icon size={14}/></span></h2>
                  <span className="font-mono text-4xl font-bold">{data.top5MostBought.map((item,index:number)=>(
                    <div key={index} className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1 text-sm font-thin">
                        <span>{item.name}</span>
                        <span>{item.value.price}</span>
                      </div>
                      <div className="rounded-md bg-stone-200">
                        <img src={item.value.url} alt={item.name} className="object-cover w-10 h-10 rounded-lg"/>
                      </div>
                    </div>
                  ))}</span>
              </div>
              <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                  <h2 className="flex justify-between w-full font-semibold text-md">Top 5 most bought orders: <span><User2Icon size={14}/></span></h2>
                  <span className="font-mono text-4xl font-bold">{data.top5MostBought.map((item,index:number)=>(
                    <div key={index} className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1 text-sm font-thin">
                        <span>{item.name}</span>
                        <span>{item.value.price}</span>
                      </div>
                      <div className="rounded-md bg-stone-200">
                        <img src={item.value.url} alt={item.name} className="object-cover w-10 h-10 rounded-lg"/>
                      </div>
                    </div>
                  ))}</span>
              </div>
              <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                  <h2 className="flex justify-between w-full font-semibold text-md">Top 5 most bought orders: <span><User2Icon size={14}/></span></h2>
                  <span className="font-mono text-4xl font-bold">{data.top5MostBought.map((item,index:number)=>(
                    <div key={index} className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1 text-sm font-thin">
                        <span>{item.name}</span>
                        <span>{item.value.price}</span>
                      </div>
                      <div className="rounded-md bg-stone-200">
                        <img src={item.value.url} alt={item.name} className="object-cover w-10 h-10 rounded-lg"/>
                      </div>
                    </div>
                  ))}</span>
              </div>
              <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
                  <h2 className="flex justify-between w-full font-semibold text-md">Top 5 most bought orders: <span><User2Icon size={14}/></span></h2>
                  <span className="font-mono text-4xl font-bold">{data.top5MostBought.map((item,index:number)=>(
                    <div key={index} className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1 text-sm font-thin">
                        <span>{item.name}</span>
                        <span>{item.value.price}</span>
                      </div>
                      <div className="rounded-md bg-stone-200">
                        <img src={item.value.url} alt={item.name} className="object-cover w-10 h-10 rounded-lg"/>
                      </div>
                    </div>
                  ))}</span>
              </div>
            </div> */}
            {/* graph */}
            {
              graphData &&(
                <div className="grid md:grid-cols-2">
                  <div className="h-64 gap-2 px-4 mt-6 ">
                    
                    <ResponsiveContainer width="100%" height="100%">
                      
                      <BarChart width={100} height={250} data={graphData} barSize={60} >
                      <CartesianGrid strokeDasharray="3 4" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalOrders" fill="#f97316" />
                      {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                    </BarChart>
                    </ResponsiveContainer>
                    
                    
                  </div>
                  <div className="h-64 gap-2 px-4 mt-6 ">
                    <ResponsiveContainer width="100%" height="100%">
                        
                        <BarChart width={730} height={250}  data={graphData} barSize={60} >
                        <CartesianGrid strokeDasharray="3 4" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalSale" fill="#8884d8" />
                        {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                      </BarChart>
                      </ResponsiveContainer>
                  </div>
                
                </div>
              )
            }
            
        </div>
    </div>
  )
}

export default OrderTable