import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { deleteSingleProduct, fetchAllProductCategory, fetchProductByCategoryWithLimit, fetchProductsWithLimit, fetchSingleProduct, forcedLogout } from "../http/api"
import { ArrowBigDownIcon, ArrowUp01Icon, ChevronDownIcon, ChevronLeft, ChevronRight,  Eye, PackageSearch, Pencil, Search, Trash2 } from "lucide-react"
import TableLoader from "../components/skeleton/TableLoader"
import { useEffect, useState } from "react"
import { debounce } from "lodash"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { Product } from "../types/product"
import { Link, useNavigate } from "react-router-dom"
import { queryClient } from "../main"
import { ToastContainer, toast } from 'react-toastify';
import { AxiosError } from "axios"
import { deleteUser } from "../features/auth/authSlice"
import { useDispatch } from "react-redux"

interface ErrorResponse {
  message: string;
}

const ProductTable = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [limit, setLimit] = useState(5)
  const [skip, setSkip] = useState(0)
  const [category, setCategory] = useState("")
  const [productData, setProductData] = useState<Product[]>([])
  const [id,setId]= useState("")
  const [currentPage, setCurrentPage] = useState(null)
  // const [previousPage, setPreviousPage] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  // const [nextPage, setNextPage] = useState(null)
  const [totalproducts, setTotalProducts] = useState(0)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // Fetch products data
  const { data, isLoading, isError ,error } = useQuery({
    queryKey: ["products", limit, skip, category],
    queryFn: async () => {
      try {
        let response;
        if (category) {
          response = await fetchProductByCategoryWithLimit({
            limit,
            skip,
            category: [category]
          });
        } else {
          response = await fetchProductsWithLimit(limit, skip);
        }
        return response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    staleTime: 40 * (60 * 1000),
    gcTime: 15 * (60 * 1000),
    refetchIntervalInBackground: true,
    placeholderData: keepPreviousData
  })

  const {data:SingleProductData}=useQuery({
    queryKey:["singleProduct",id],
    queryFn:async()=>{
      try {
        
        const response = await fetchSingleProduct(id)
        return response
        
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    enabled:!!id
  })

  // delete single product
  const mutation= useMutation({
    mutationKey:["deleteProduct",id],
    mutationFn:deleteSingleProduct,
    onError:()=>{},
    onSuccess:async()=>{
      await queryClient.refetchQueries({ queryKey: ['products', limit, skip] });
      toast.success('Proudct is deleted successfully',{position:'top-right'})
    }
  })
  
  // Fetch categories data
  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["category"],
    queryFn: fetchAllProductCategory
  })

  // mutation query for forced logout user in case of error (in case of access token not found)
  const logoutMutation = useMutation({
    mutationKey:["logoutUser"],
    mutationFn:forcedLogout,
    onSuccess:()=>{
      dispatch(deleteUser())
      sessionStorage.removeItem('user')
      navigate('/dashboard/auth/login')
    }
  })

  // Update product data when API response changes
  useEffect(() => {
    if (data?.products) {
      setProductData(data.products);
      console.log("Updated product data:", data.products);
      console.log("data",data);
      setTotalPages(data.totalPages)
      setCurrentPage(data.currentPage)
      setTotalProducts(data.total)
    }
  }, [data]);

  // Handle view and edit actions
  const handleViewAction = (id: string) => {
    console.log("View product:", id);
    
    // setId(id)
    navigate(`/dashboard/product/singleProduct/${id}`)
  }

  const handleEditAction = (id: string) => {
    console.log("Edit product:", id);
    navigate(`/dashboard/product/editProduct/${id}`)
  }

  const handleDeleteAction = (id:string)=>{
    console.log("Delete product:",id);
    setId(id)
    mutation.mutate(id)
  }
  if(SingleProductData){
    console.log("SingleProductData :",SingleProductData);
    
  }

  // Table column definitions
  const columnHelper = createColumnHelper<Product>()
  const columns = [
    columnHelper.accessor("image", {
      cell: (info) => (
        <img 
          src={info.getValue()} 
          alt="Product" 
          className="object-cover w-16 h-16 rounded-lg"
          // onError={(e) => {
          //   (e.target as HTMLImageElement).src = '/placeholder-image.png' // Add a placeholder image
          // }}
        />
      ),
      header: () => <span>Image</span>
    }),
    columnHelper.accessor("title", {
      cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
      header: () => <span>Title</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("brand", {
      cell: (info) => info.getValue(),
      header: () => <span >Brand</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("category", {
      cell: (info) => {
        const categories = info.getValue();
        return Array.isArray(categories) ? categories.join(', ') : categories;
      },
      header: () => <span>Category</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("currency", {
      cell: (info) => info.getValue(),
      header: () => <span>Currency</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("price", {
      cell: (info) => info.getValue().toLocaleString(),
      header: () => <span>Price</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("salePrice", {
      cell: (info) => info.getValue().toLocaleString(),
      header: () => <span>Sale Price</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("totalStock", {
      cell: (info) => info.getValue(),
      header: () => <span>Stock</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("_id", {
      cell: (info) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleViewAction(info.getValue())}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Eye className="hover:text-sky-600" size={18} />
          </button>
          <button 
            onClick={() => handleEditAction(info.getValue())}
            className="p-1 rounded hover:bg-gray-100"
          >
            <Pencil className="hover:text-sky-600" size={18} />
          </button>
          <button 
            onClick={() => handleDeleteAction(info.getValue())}
            className="p-1 rounded hover:bg-gray-100"
          >
            {/* <Trash className="hover:text-red-600" size={18} /> */}
            <Trash2 className="hover:text-red-600" size={18}/>
          </button>
        </div>
      ),
      header: () => <span>Actions</span>,
    }),
  ]
  
  // Initialize table
  const table = useReactTable({
    data: productData,
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
  // useEffect(() => {
  //   const page = table.getState().pagination.pageIndex;
  //   setSkip(page * limit);
  // }, [limit, table]);
  const handlePrevBtn = ()=>{
    console.log("skip -----: ",skip)
    console.log("limit ------: ",limit)
    setSkip((prev)=>prev-limit)
  }
  const handleNextBtn = ()=>{
    setSkip((prev)=> prev+limit)
  }

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSkip(0);
    table.setPageIndex(0);
  };

  if (isLoading || isCategoryLoading) {
    return <TableLoader />;
  }
  
  
  if (isError) {
    const axiosError = error as AxiosError<ErrorResponse>; 
    const errorMessage =
      axiosError.response?.data?.message || "Something went wrong!.Error loading products. Please try again later.Or refresh the page";
    console.log("isError TABLE",isError)
    console.error("Query Error:", errorMessage);
    if(axiosError.status === 401){
        console.error("axiosError:", axiosError.status);
        // TODO: CALL LOgout api and navigate to login page
        logoutMutation.mutate()
        // dispatch(deleteUser())
        // sessionStorage.removeItem('user')
        // const res = forcedLogout()
        // if(res){
        //     console.log("Logout response : ",res)
        // }
        // navigate('/dashboard/auth/login')
    }
    return (
      <div className="p-4 text-4xl font-bold text-center text-red-600 bg-red-100 rounded-md">
        { errorMessage }
      </div>
    );
  }

  return (
    <div className='container grid w-full grid-cols-1 p-2 bg-dashboard/50'>
      <div className="p-6 w-[90%] bg-card/75 text-copy-primary md:w-[96%] mx-auto rounded-md">
        <h1 className="pb-4 mb-6 text-2xl font-bold text-center border-b-2 border-b-stone-600">
          Product Details
        </h1>

        {/* Category Filter */}
        <div>
          <div className="flex items-center w-full mt-6 rounded-md bg-stone-400">
            <div className="flex items-center w-full px-2">
              <span className="text-base text-gray-500 select-none">
                <PackageSearch />
              </span>
              <input 
                type="text" 
                placeholder="Search product by category"
                onChange={debounce((e) => handleCategoryChange(e.target.value), 800)}
                className="w-full pl-4 text-base text-gray-900 bg-transparent outline-none rounded-s-lg placeholder:text-gray-800 sm:text-sm/6"
              />  
            </div>
            <div className="relative grid items-center justify-center grid-cols-1 text-black border rounded-md shrink-0 bg-stone-100 focus-within:relative">
              <select 
                className="self-center w-full bg-transparent rounded-md appearance-none py-1.5 pr-7 pl-3 text-base focus:ring-2 focus:ring-indigo-600 sm:text-sm/6 col-start-1 row-start-1 outline-none text-black"
                onChange={(e) => handleCategoryChange(e.target.value)}
                value={category}
              >
                <option value="">All Categories</option>
                {categoryData?.data.categories.map((item: string, index: number) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
              <ChevronDownIcon className="self-center col-start-1 row-start-1 mr-2 text-black pointer-events-none size-5 sm:size-4 justify-self-end"/>
            </div>
          </div>
        </div>

        {/* Global Search */}
        <div className="relative mt-6 mb-4">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Find in table..."
            className="w-full py-2 pl-10 pr-4 border rounded-md shadow-sm outline-none focus:ring-indigo-500 focus:border-indigo-500 text-stone-900 placeholder:text-stone-600 focus:ring-2"
          />
          <Search
            className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
            size={20}
          />
        </div >
                
        <div className="flex items-center justify-between mb-4">
          <p className="">Click a table header to apply  sorting functions. Total Product : {data?.total}</p>
          <Link to={'/dashboard/product/createProduct'}  className="self-center px-2 py-1 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600">Add Product</Link>
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
                    No products found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm font-medium text-gray-500 whitespace-nowrap">
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
        {/* <div className="flex flex-col items-center justify-between mt-4 text-sm text-gray-700 sm:flex-row">
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
        </div> */}
        <div className="flex flex-col items-center justify-between mt-4 text-sm text-gray-700 sm:flex-row">
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
                <span className="text-copy-primary/90">Total products {totalproducts}</span>
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
      <ToastContainer/>
    </div>
  )
}

export default ProductTable