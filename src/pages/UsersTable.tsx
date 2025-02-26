import { useMutation, useQuery } from "@tanstack/react-query"
import { allUser, forcedLogout } from "../http/api"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteUser, updateAccessToken } from "../features/auth/authSlice"
import { RootState } from "../app/store"
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender,getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import { User } from "../types/user"
import {  ChevronLeft, ChevronRight, Search, User2Icon } from "lucide-react"
import TableLoader from "../components/skeleton/TableLoader"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
// import { ToastContainer, toast } from 'react-toastify';
// import { useNavigate } from "react-router-dom"

interface ErrorResponse {
    message: string;
  }

const UsersTable = () => {
    const [limit, setLimit] = useState(5)
    const [skip, setSkip] = useState(0)
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [currentPage, setCurrentPage] = useState(null)
    // const [previousPage, setPreviousPage] = useState(null)
    const [totalPages, setTotalPages] = useState(null)
    // const [nextPage, setNextPage] = useState(null)
    const [totalusers, setTotalUsers] = useState(0)
    
    
    const userData = useSelector((state:RootState)=>state.auth)
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    // query for get all users
    const {data,isError,isLoading,error} = useQuery({
        queryKey:["getAllUsrs",limit,skip],
        queryFn:async()=>{
            const res = await  allUser(limit,skip)
            return res.data
        },
        // placeholderData:true
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
    
    
    const {accessToken,refreshToken} = userData
    useEffect(()=>{
        if(data){
            const fetchUserData = data
            console.log("fetchUserData : ",fetchUserData)
            console.log("Fetched data:",fetchUserData)
            setCurrentPage(fetchUserData.currentPage)
            // setPreviousPage(fetchUserData.prevPage)
            setTotalPages(fetchUserData.totalPages)
            setTotalUsers(fetchUserData.totalUsers)
            // setNextPage(fetchUserData.nextPage)
            console.log("fetchUserData.currentPage",fetchUserData.currentPage);
            
            // TODO: Not updating token?
            if(fetchUserData.isAccessTokenExp){
                 dispatch(updateAccessToken(fetchUserData.accessToken))
                
                // console.log("Dispatched updateAccessToken:", fetchUserData.accessToken);
            }
        }
    },[data, dispatch])
    // TODO: REMOVE USEEFFECT ON PRODUCTION This is only checking
  useEffect(() => {
    // console.log(userData)
    console.log('Current Access Token:', accessToken);
    console.log('Current Refresh Token:', refreshToken);
  }, [accessToken, refreshToken,userData]);
    
    // Handle view and edit actions
//   const handleViewAction = (id: string) => {
//     console.log("View user:", id);
    
//     // setId(id)
//     // navigate(`/dashboard/product/singleProduct/${id}`)
//   }
  
    
    // Table column definitions
    const columnHelper = createColumnHelper<User>()
    const columns = [
        columnHelper.accessor("name",{
            cell:(info)=>info.getValue(),
            header:()=><span>Name</span>,
            enableSorting: true,
        }),
        columnHelper.accessor("email",{
            cell:(info)=>info.getValue(),
            header:()=><span>Email</span>,
            enableSorting: true,
        }),
        columnHelper.accessor("role",{
            cell:(info)=>info.getValue(),
            header:()=><span>Role</span>,
            enableSorting: true,
        }),
        columnHelper.accessor("createdAt",{
            cell:(info)=>{
                const localDateFormate = new Date(info.getValue()).toLocaleString()
                return <span>{localDateFormate}</span>
            },
            header:()=><span>CreatedAt</span>,
            enableSorting: true,
        }),
        // columnHelper.accessor("_id",{
        //     cell:(info)=>(
        //         <button 
        //         onClick={() => handleViewAction(info.getValue())}
        //         className="p-1 rounded hover:bg-gray-100"
        //         >
        //         <Eye className="hover:text-sky-600" size={18} />
        //         </button>
        //     ),
        //     header:()=> <span>Actions</span>
        // })
    ]

    // Initialize table
    const table = useReactTable({
        data:data?.allUsers
        ,
        columns,
        state: {
          sorting,
          globalFilter
        },
        initialState: {
          pagination: {
            pageSize: limit,
          }
        },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil((data?.total || 0) / limit)
      })
    // Update skip value when page changes
//   useEffect(() => {
//     const page = table.getState().pagination.pageIndex;
//     setSkip(page * limit);
//   }, [limit, table]);
  const handlePrevBtn = ()=>{
    setSkip((prev)=>prev-limit)
  }
  const handleNextBtn = ()=>{
    setSkip((prev)=> prev+limit)
  }
  
    if (isError) {
        const axiosError = error as AxiosError<ErrorResponse>; 
        const errorMessage =
          axiosError.response?.data?.message || "Something went wrong!.Error loading user details. Please try again later.Or refresh the page";
        
        if(axiosError.status === (401 )){
            console.error("axiosError:", axiosError.status);
            // TODO: CALL LOgout api and navigate to login page
            // const res = forcedLogout()
            
            // sessionStorage.removeItem('user')
            // if(res){
            //     console.log("Logout response : ",res)
            // }
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
    
    console.log("table.getState()",table.getState())
    console.log("table.getPageCount()",table.getPageCount())
    console.log("table.getPageCount()",table.getPageCount())
    // console.log("table.nextPage()",table.nextPage())
  return (
    <div className="container grid w-full grid-cols-1 p-2 bg-dashboard/50">
        <div className="p-6 w-[90%] bg-card/75 text-copy-primary md:w-[96%] mx-auto rounded-md">
            <h1 className="pb-4 mb-6 text-2xl font-bold text-center border-b-2 border-b-stone-600">
            UsersTable
            </h1>
            
          <div className="grid gap-4 auto-rows-min md:grid-cols-3">
            <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
              <h2 className="flex justify-between w-full font-semibold text-md">Number of Admin: <span><User2Icon size={14}/></span></h2>
              <span className="font-mono text-4xl font-bold">{data.totalAdmin}</span>
            </div>
            <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
              <h2 className="flex justify-between w-full font-semibold text-md">Number of Manager: <span ><User2Icon size={14} /></span></h2>
              <span className="font-mono text-4xl font-bold">{data.totalManager}</span>
              <span className="text-sm font-medium text-copy-primary/70 text-pretty">+{data.lastThirtyDaysUserCount.managerAdded} from last month</span>
            </div>
            <div className="flex flex-col gap-2 p-2 rounded-xl bg-stone-400/50 aspect-auto" >
              <h2 className="flex justify-between w-full font-semibold text-md">Number of Users: <span><User2Icon size={14}/></span></h2>
              <span className="font-mono text-4xl font-bold">{data.totalUser}</span>
              <span className="text-sm font-medium text-copy-primary/70 text-pretty">+{data.lastThirtyDaysUserCount.usersAdded} from last month</span>
            </div>
            
          </div>
            {/*Table Global Search */}
            <div className="relative mt-6 mb-4">
                <input
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Find in table..."
                className="w-full py-2 pl-10 pr-4 border rounded-md shadow-sm outline-none focus:ring-indigo-500 focus:border-indigo-500 text-stone-900 placeholder:text-stone-600 focus:ring-2 bg-stone-200"
                />
                <Search
                    className="absolute text-gray-600 transform -translate-y-1/2 left-3 top-1/2"
                    size={20}
                />
            </div>
            {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded">
            <thead className="bg-stone-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th 
                      key={header.id} 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-white uppercase "
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className={`${header.column.getCanSort() ? 'flex items-center cursor-pointer select-none' : ''}`}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" && <span className="ml-2">  🔼  </span>}
                        {header.column.getIsSorted() === "desc" && <span className="ml-2">🔽</span>}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                    No Users found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-100">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        
        
            <div className="flex flex-col items-center justify-between mt-4 text-sm text-gray-700 sm:flex-row">
                <div className="flex items-center mb-4 sm:mb-0">
                    <span className="mr-2 text-copy-primary/60">Items per page</span>
                    <select
                    value={table.getState().pagination.pageSize}
                    className="p-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                <span className="text-copy-primary/90">Total users {totalusers}</span>
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
        </div >
        
        
    {/* <ToastContainer/> */}
    </div>
  )
}

export default UsersTable