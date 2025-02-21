import { useQuery } from "@tanstack/react-query"
import { allUser } from "../http/api"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateAccessToken } from "../features/auth/authSlice"
import { RootState } from "../app/store"
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender,getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import { User } from "../types/user"
import { ArrowBigDownIcon, ArrowUp01Icon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Search } from "lucide-react"
// import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom"


const UsersTable = () => {
    const [limit, setLimit] = useState(5)
    const [skip, setSkip] = useState(0)
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState("")
    const userData = useSelector((state:RootState)=>state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {data,isError,isLoading} = useQuery({
        queryKey:["getAllUsrs",limit,skip],
        queryFn:async()=>{
            const res = await  allUser(limit,skip)
            return res.data
        }
    })
    const {accessToken,refreshToken} = userData
    useEffect(()=>{
        if(data){
            const fetchUserData = data
            console.log("fetchUserData : ",fetchUserData)
            console.log("Fetched data:",fetchUserData)
            // TODO: Not updating token?
            if(fetchUserData.isAccessTokenExp){
                dispatch(updateAccessToken(fetchUserData.accessToken))
                console.log("Dispatched updateAccessToken:", fetchUserData.accessToken);
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
  const handleViewAction = (id: string) => {
    console.log("View product:", id);
    
    // setId(id)
    navigate(`/dashboard/product/singleProduct/${id}`)
  }
  
    
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
        columnHelper.accessor("_id",{
            cell:(info)=>(
                <button 
                onClick={() => handleViewAction(info.getValue())}
                className="p-1 rounded hover:bg-gray-100"
                >
                <Eye className="hover:text-sky-600" size={18} />
                </button>
            ),
            header:()=> <span>Actions</span>
        })
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
  useEffect(() => {
    const page = table.getState().pagination.pageIndex;
    setSkip(page * limit);
  }, [limit, table]);
    if(isError){
        return <div>Error</div>
    }
    if(isLoading){
        return <div>Loading...</div>
    }
    
  return (
    <div className="container grid w-full grid-cols-1 p-2 bg-dashboard/50">
        <div className="p-6 w-[90%] bg-card/75 text-copy-primary md:w-[96%] mx-auto rounded-md">
            <h1 className="pb-4 mb-6 text-2xl font-bold text-center border-b-2 border-b-stone-600">
            UsersTable
            </h1>
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
                        {header.column.getIsSorted() === "asc" && <ArrowUp01Icon className="ml-2" size={14}/>}
                        {header.column.getIsSorted() === "desc" && <ArrowBigDownIcon className="ml-2" size={16}/>}
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
                  <tr key={row.id} className="hover:bg-gray-50">
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
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                const newLimit = Number(e.target.value);
                setLimit(newLimit);
                table.setPageSize(newLimit);
              }}
            >
              {[5, 10, 20, 30].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <ChevronsLeft size={20} />
            </button>

            <button
              className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <ChevronLeft size={20} />
            </button>

            <span className="flex items-center">
              <input
                min={1}
                max={table.getPageCount()}
                type="number"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="w-16 p-2 text-center border border-gray-300 rounded-md"
              />
              <span className="ml-1 text-copy-primary/60">of {table.getPageCount()}</span>
            </span>

            <button
              className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              <ChevronRight size={20} />
            </button>

            <button
              className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || isLoading}
            >
              <ChevronsRight size={20} />
            </button>
          </div>
        </div>
        </div >
        
        
    {/* <ToastContainer/> */}
    </div>
  )
}

export default UsersTable