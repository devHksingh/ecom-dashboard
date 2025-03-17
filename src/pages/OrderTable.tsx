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
import { Award, CheckCircle, ChevronLeft, ChevronRight, DollarSign, Eye, Package, PackageSearch, Pencil, ShoppingBag, TrendingDown, TrendingUp, Truck, User2Icon } from "lucide-react"
// import { createColumnHelper, useReactTable } from "@tanstack/react-table"
// import { OrderTable } from "../types/order"
import { Search, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel
} from '@tanstack/react-table';
import {  OrderBoughtItem, OrderTableProps } from "../types/order"


interface ErrorResponse {
    message: string;
  }

const OrderTable = () => {
    const [limit,setLimit]= useState(10)
    const [skip,setSkip]= useState(0)
    // const [orderData,setOrderData]= useState(null)
    // const [past30DaysOrders,setPast30DaysOrders]= useState(null)
    // const [top5MostBought,setTop5MostBought]= useState(null)
    const [top5LeastBought,setTop5LeastBought]= useState(null)
    const [graphData,setGraphData] = useState(null)
    const [year,setYear] = useState(2025)
    const [globalFilter, setGlobalFilter] = useState('');
    const [orders,setOrders] = useState([])
    const [currentPage, setCurrentPage] = useState(null)
      // const [previousPage, setPreviousPage] = useState(null)
      const [totalPages, setTotalPages] = useState(null)
      // const [totalOrders, setTotalOrders] = useState(null)
    
    // redux 
    // const userData = useSelector((state:RootState)=>state.auth)
    const dispatch = useDispatch()

    // react router dom
    const navigate = useNavigate()

    const {data,isError,isLoading,error} = useQuery({
        queryKey:["getAllOrder",limit,skip],
        queryFn:()=>getAllOrders(limit,skip),
        staleTime:6000,
        refetchInterval:8000,
        refetchIntervalInBackground:true
    })
    // mutation query for forced logout user in case of error (in case of access token not found)
    const {data:orderGraphData,isLoading:graphDataLoading} = useQuery({
      queryKey:["orderGraphData",year],
      queryFn:()=>getgraphData(year),
      staleTime:6000,
      refetchInterval:8000,
      refetchIntervalInBackground:true
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
            // setOrderData(data.totalOrdersArr)
            // setPast30DaysOrders(data.past30DaysOrders)
            // setTop5MostBought(data.top5MostBought)
            setTop5LeastBought(top5LeastBought)
            setOrders(data.totalOrdersArr)
            setTotalPages(data.totalPages)
            setCurrentPage(data.currentPage)
            // setTotalOrders(data.totalOrders)
        }
    },[data, dispatch, top5LeastBought])
    
    
    console.log("graphData",graphData);

    // table

    
  
  // Format date
  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format currency
  const formatPrice = (amount:number, currency:string) => {
    const symbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'INR': '₹',
       'RUB':'₽',
       'GBP':'£'
    };
    
    return `${symbols[currency]|| '₹' } ${amount}`;
  };
  

    // Handle view and edit actions
  const handleViewAction = (id: string) => {
    console.log("View product:", id);
    
    // setId(id)
    navigate(`/dashboard/order/singleOrder/${id}`)
  }
  const handleEditAction = (id: string) => {
    console.log("Edit product:", id);
    navigate(`/dashboard/product/editProduct/${id}`)
  }

  // pageination btn
  const handlePrevBtn = ()=>{
    console.log("skip -----: ",skip)
    console.log("limit ------: ",limit)
    setSkip((prev)=>prev-limit)
  }
  const handleNextBtn = ()=>{
    setSkip((prev)=> prev+limit)
  }

   const columnHelper = createColumnHelper<OrderTableProps>()
   
   const columns = [
    columnHelper.accessor('productDetail.imageUrl',{
      cell:(info)=>(
        <div>
        <div className="flex-shrink-0 w-10 h-10">
        <img 
          className="object-cover w-10 h-10 rounded-md" 
          src={info.row.original.productDetail.imageUrl} 
          alt={info.row.original.productDetail.name} 
        />
        </div>
          
        </div>
      // <div>
      //   <img src={info.row.original.productDetail.imageUrl} alt={info.row.original.productDetail.name} className="object-cover w-10 h-10 rounded-md"/>
      // </div>
      ),
      header:()=><div>Image</div>
    }),
    columnHelper.accessor('productDetail.name',{
      cell:(info)=>(<div className="text-sm font-medium text-gray-900">{info.getValue()}</div>),
      header:()=><div className="flex items-center gap-1 capitalize">product Name</div>
    }),
    columnHelper.accessor('userDetails.userEmail',{
      cell:(info)=>(<div className="text-sm text-gray-500">{info.getValue()}</div>),
      header:()=><div className="flex items-center gap-1 capitalize">user email</div>
    }),
    columnHelper.accessor('trackingId',{
      cell:(info)=> (<div className="text-sm text-gray-500">{info.getValue()}</div>),
      header:() => <div className="flex items-center gap-1">Tracking ID</div>
    }),
    columnHelper.accessor('orderPlaceOn', {
      header: () => <div className="flex items-center gap-1 capitalize">Order Date</div>,
      cell: info => (<div className="text-gray-800">{formatDate(info.getValue())}</div>),
    }),
    columnHelper.accessor('totalPrice', {
      header: () => <div className="flex items-center gap-1 capitalize">Price</div>,
      cell: info => (
        <div className="text-sm font-medium text-gray-900">
          {formatPrice(info.getValue(), info.row.original.productDetail.currency)}
        </div>
      ),
    }),
    columnHelper.accessor('quantity', {
      header: () => <div className="flex items-center gap-1">Qty</div>,
      cell: info => <div className="text-sm text-gray-500">{info.getValue()}</div>,
    }),
    columnHelper.accessor('orderStatus', {
      header: () => <div className="flex items-center gap-1">Status</div>,
      cell: info => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${info.getValue() === 'PROCESSED' ? 'bg-red-100 text-red-800' : 
            info.getValue() === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
            info.getValue() === 'SHIPPED' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'}`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('_id',{
      header: () => <div className="flex items-center gap-1 capitalize">Actions</div>,
      cell: info =>(
        <div className="flex gap-2">
          <button 
            onClick={() => handleViewAction(info.getValue())}
            className="p-1 rounded hover:bg-gray-100 "
          >
            <Eye className=" text-sky-500 hover:text-sky-600" size={18} />
          </button>
          <button 
            onClick={() => handleEditAction(info.getValue())}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Pencil className="text-orange-600 hover:text-orange-500" size={18} />
          </button>
        </div>
      )
    })
   ]
   
   const table = useReactTable({
    data:orders,
    columns,
    state: {
      
      globalFilter
    },
    getCoreRowModel:getCoreRowModel(),
     getSortedRowModel: getSortedRowModel(),
     getFilteredRowModel: getFilteredRowModel(),
     getPaginationRowModel: getPaginationRowModel(),
         manualPagination: true,
         pageCount: Math.ceil((data?.totalOrders || 0) / limit)
   })

   

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
    console.log("orders table",table.getHeaderGroups());
    
  return (
    <div className="container grid w-full grid-cols-1 p-2 bg-dashboard/50">
      <div className="p-6 w-[90%] bg-card/75 text-copy-primary md:w-[96%] mx-auto rounded-md">
        <h1 className="pb-4 mb-6 text-2xl font-bold text-center border-b-2 border-b-stone-600">
            OrdersTable
        </h1>
        {/* TOP SECTION */}

        {/* test */}
        <div className="container p-4 mx-auto">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Total Sale Amount */}
        <div className="p-6 border border-blue-200 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl md:col-span-2">
          <div className="flex items-center mb-4">
            <DollarSign className="w-6 h-6 mr-2 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">Total Sale Amount</h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-blue-700">{(data.totalSaleAmount)}</p>
            <p className="mt-1 text-sm text-blue-600">Across all products</p>
          </div>
        </div>

        

        {/* Total order placed till now */}
        <div className="p-6 border border-green-200 shadow-sm bg-gradient-to-br from-green-50 to-green-100 rounded-xl md:col-span-2">
          <div className="flex items-center mb-4">
            <ShoppingBag className="w-6 h-6 mr-2 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">Total orders </h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-green-700">{data.totalOrders}</p>
            <p className="mt-1 text-sm text-green-600">Total order placed till now</p>
          </div>
        </div>
        
        {/* Number of order last 30 days */}
        <div className="p-6 border border-green-200 shadow-sm bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <div className="flex items-center mb-4">
            <ShoppingBag className="w-6 h-6 mr-2 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">Orders (30 Days)</h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-green-700">{data.past30DaysOrders.length}</p>
            <p className="mt-1 text-sm text-green-600">Last 30 days</p>
          </div>
        </div>

        {/* Order Status Cards Row */}
        <div className="p-6 border shadow-sm bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border-amber-200">
          <div className="flex items-center mb-4">
            <Package className="w-6 h-6 mr-2 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-800">Processed</h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-amber-700">{data.productOrderStatusCount.processed}</p>
            <p className="mt-1 text-sm text-amber-600">Orders in process</p>
          </div>
        </div>

        <div className="p-6 border border-indigo-200 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
          <div className="flex items-center mb-4">
            <Truck className="w-6 h-6 mr-2 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-800">Shipped</h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-indigo-700">{data.productOrderStatusCount.shipped}</p>
            <p className="mt-1 text-sm text-indigo-600">Orders in transit</p>
          </div>
        </div>

        <div className="p-6 border shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border-emerald-200">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 mr-2 text-emerald-500" />
            <h3 className="text-lg font-semibold text-gray-800">Delivered</h3>
          </div>
          <div className="mt-2">
            <p className="text-3xl font-bold text-emerald-700">{data.productOrderStatusCount.delivered}</p>
            <p className="mt-1 text-sm text-emerald-600">Completed orders</p>
          </div>
        </div>

        {/* Top 5 most bought orders */}
        <div className="p-6 border border-purple-200 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl md:col-span-2">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 mr-2 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-800">Top 5 Most Bought</h3>
          </div>
          <div className="mt-2">
            <ul className="space-y-2">
              {data.top5MostBought.map((item:OrderBoughtItem, index:number) => (
                <li key={index} className="flex items-center justify-between pb-2 border-b border-purple-200">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-medium text-purple-700">{item.value.quantity} units</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top 5 Most Expensive Orders */}
        <div className="p-6 border border-red-200 shadow-sm bg-gradient-to-br from-red-50 to-red-100 rounded-xl md:col-span-2">
          <div className="flex items-center mb-4">
            <DollarSign className="w-6 h-6 mr-2 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-800">Top 5 Most Expensive</h3>
          </div>
          <div className="mt-2">
            <ul className="space-y-2">
              {data.top5MostExpensiveOrders.map((item:OrderTableProps, index:number) => (
                <li key={index} className="flex items-center justify-between pb-2 border-b border-red-200">
                  <span className="text-gray-700">{item.productDetail.name}</span>
                  <span className="font-medium text-red-700">{formatPrice(item.productDetail.price,"USD")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top 5 Least Expensive Orders */}
        <div className="p-6 border border-teal-200 shadow-sm bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl md:col-span-2">
          <div className="flex items-center mb-4">
            <DollarSign className="w-6 h-6 mr-2 text-teal-500" />
            <h3 className="text-lg font-semibold text-gray-800">Top 5 Least Expensive</h3>
          </div>
          <div className="mt-2">
            <ul className="space-y-2">
              {data.top5LeastExpensiveOrders.map((item:OrderTableProps, index:number) => (
                <li key={index} className="flex items-center justify-between pb-2 border-b border-teal-200">
                  <span className="text-gray-700">{item.productDetail.name}</span>
                  <span className="font-medium text-teal-700">{formatPrice(item.productDetail.price,"USD")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Top 5 Least Bought */}
        <div className="p-6 border border-orange-200 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl md:col-span-2">
          <div className="flex items-center mb-4">
            <TrendingDown className="w-6 h-6 mr-2 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-800">Top 5 Least Bought</h3>
          </div>
          <div className="mt-2">
            <ul className="space-y-2">
              {data.top5LeastBought.map((item:OrderBoughtItem, index:number) => (
                <li key={index} className="flex items-center justify-between pb-2 border-b border-orange-200">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-medium text-orange-700">{item.value.quantity} units</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
        </div>
        

        

        
        {/* grid */}
        <div className="grid gap-4 auto-rows-min md:grid-cols-3">
          <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
            <h2 className="flex justify-between w-full font-semibold capitalize text-md">Total sale Amount: <span><User2Icon size={14}/></span></h2>
            <span className="font-mono text-4xl font-bold">${data.totalSaleAmount}</span>
          </div>
          <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
            <h2 className="flex justify-between w-full font-semibold text-md">Number of order last 30 days: <span > <PackageSearch size={14} /></span></h2>
            <span className="font-mono text-4xl font-bold">{data.totalOrders}</span>
            <span className="text-sm font-medium text-copy-primary/70 text-pretty">+{data.past30DaysOrders.length} from last month</span>
          </div>
          <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
            <h2 className="flex justify-between w-full font-semibold capitalize text-md">Top 5 most bought orders: <span> <Award size={14}/></span></h2>
            <span className="flex flex-col flex-wrap gap-2 justify-evenly md:flex-row">{data.top5MostBought.map((item:OrderBoughtItem,index:number)=>(
          <div key={index} className="relative self-center cursor-pointer group">
            
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
            <span className="flex flex-col items-center justify-between gap-2 md:flex-row">{data.top5MostExpensiveOrders.map((item:OrderTableProps,index:number)=>(
          <div key={index} className="relative self-center cursor-pointer group">
            
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
            <span className="flex flex-col items-center justify-between gap-2 md:flex-row">{data.top5LeastExpensiveOrders.map((item:OrderTableProps,index:number)=>(
          <div key={index} className="relative self-center cursor-pointer group">
            
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
            <span className="flex flex-col items-center justify-between gap-2 md:flex-row">{data.top5LeastBought.map((item:OrderBoughtItem,index:number)=>(
          <div key={index} className="relative self-center cursor-pointer group">
            
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
        {/* graph */}
        {graphData && (
          <div className="p-1 mt-6">
          <span className="mr-2 text-copy-primary/60">Select year</span>
          <select 
            className="p-2 text-black border border-gray-300 rounded-md shadow-sm outline-none focus:ring-indigo-500 focus:border-indigo-500 ring-2"
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))}
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
        )
        }
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

        {/* table */}
        
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold">Orders</div>
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-500 left-2 top-3" />
              <input
                type="text"
                placeholder="Search orders..."
                className="py-2 pl-8 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-stone-900"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
          </div>
  
  <div className="overflow-x-auto border border-gray-200 rounded-lg">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th 
                key={header.id}
                className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                onClick={header.column.getToggleSortingHandler()}
              >
                <div className="flex items-center gap-1">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanSort() && (
                    <div className="flex">
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {table.getRowModel().rows.map(row => (
          <tr key={row.id} className="hover:bg-gray-50">
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    
    {table.getRowModel().rows.length === 0 && (
      <div className="px-6 py-4 text-center text-gray-500">
        No orders found.
      </div>
    )}
  </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-2 mt-4 text-sm text-gray-700 sm:flex-row">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <span className="mr-2 text-copy-primary/60">Items per page</span>
                            <select
                            value={table.getState().pagination.pageSize}
                            className="p-2 text-black border border-gray-300 rounded-md shadow-sm outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:ring-2"
                            onChange={
                                (e)=>{
                                    const newLimit = Number(e.target.value)
                                    setLimit(newLimit)
                                    table.setPageSize(newLimit)
                                }
                            }
                            >
                            {[5,10,20,30].map((pageSize)=>(
                                <option key={pageSize} value={pageSize}>{pageSize}</option>
                            ))}
                        </select>
                        </div>
                        <span className="text-copy-primary/90">Total order {data.totalOrders}</span>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handlePrevBtn}
                                disabled={currentPage === 1 || isLoading}
                                aria-label="Previous Page Button"
                                className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                            >   
                                
                                <ChevronLeft size={20} />
                            </button>
                            <span className="ml-1 text-copy-primary/90">{currentPage} of {totalPages}</span>
                            <button 
                                onClick={handleNextBtn}
                                disabled={currentPage === totalPages || isLoading}
                                aria-label="Next Page Button"
                                className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                            >
                                
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        
        </div>
      </div>
    </div>
  )
}

export default OrderTable

