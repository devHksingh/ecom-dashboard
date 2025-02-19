import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { RootState } from '../app/store'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct } from '../http/api'
import { LoaderCircle } from 'lucide-react'
import { updateAccessToken } from '../features/auth/authSlice'
import { AxiosError } from 'axios'
import { queryClient } from '../main'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'


// import useAuth from '../hooks/useAuth'

interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
  message: string;
}

const productSchema = z.object({
  productImage: z.instanceof(FileList).refine((files)=>files.length ===1,{message:"Only single product image is required"}),
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(4, "Brand is required and must be 4 char long"),
  category: z.string().min(1, "Category is required"),
  currency: z.string().min(1, "Currency is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  salePrice: z.coerce.number().int().nonnegative("Sale price must be a non-negative integer"),
  totalStock: z.coerce.number().int().nonnegative("Stock must be a non-negative integer")
})

export type ProductFormData = z.infer<typeof productSchema>

const ProductForm = () => {
  // useAuth()
  // user data from state
  
  const [displayMessage,setDisplayMessage]= useState("")
  const userData = useSelector((state:RootState)=>state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {accessToken,refreshToken} = userData
  // Log tokens when component mounts
  // TODO: REMOVE USEEFFECT ON PRODUCTION
  useEffect(() => {
    console.log(userData)
    console.log('Current Access Token:', accessToken);
    console.log('Current Refresh Token:', refreshToken);
  }, [accessToken, refreshToken,userData]);

  const mutation = useMutation({
    mutationKey:["createProduct"],
    mutationFn:createProduct,
    // onError:(err:AxiosError)=>{
    //   // console.response('Mutation response:', response?.data?.message );
    //   console.log(err);
      
    //   console.log(err.response)
    //   console.log(err.message)
    //   if (err.response) {
    //     console.log("Server Response:", err.response);
    //     console.log("Error Message:", err.response.data?.message || "No error message from server");
    //     setDisplayMessage(err.response.data?.message || err.message);
    //   } else {
    //     console.log("Network or Unexpected Error:", err.message);
    //     setDisplayMessage(err.message);
    //   }
    //   // console.log(err.response.data.message)
    //   // setDisplayMessage(err.response.data.message || err.message)
    //   // const {message}= response.config
    //   // .data
    // },
    onError: (err: AxiosError<ErrorResponse>) => {
      console.log("Error:", err);
  
      if (err.response) {
        console.log("Server Response:", err.response);
  
        
        const errorData = err.response.data as ErrorResponse;
        console.log("Error Message:", errorData.message || "No error message from server");
        
        setDisplayMessage(errorData.message || "Unable uplaod product on database. try it again!");
      } else {
        console.log("Network or Unexpected Error:", err.message);
        setDisplayMessage(err.message);
      }
    },
  onSuccess:async(response)=>{
    console.log("Success:", response);
    console.log('Product created successfully');
    const {success,message,isAccessTokenExp,accessToken}= response.data
    console.log("success :",success);
    toast.success('Product is register successfully',{position:'top-right'})
    if(isAccessTokenExp){
      dispatch(updateAccessToken(accessToken))
      const userSessionData = JSON.parse(sessionStorage.getItem('user') || `{}`)
      userSessionData.accessToken = accessToken
      sessionStorage.removeItem('user')
      sessionStorage.setItem('user',JSON.stringify(userSessionData))
    }
    navigate("/dashboard/product/allProducts")
    // Marks data as stale → Immediately refetches the data from the server
    
    await queryClient.refetchQueries({ queryKey: ['products'] });
    // Marks data as stale → Triggers a refetch on the next query execution
    // await queryClient.invalidateQueries({ queryKey: ['products'] });
    setDisplayMessage(message)
    // TODO: NAVIGATE to product tabel page
  }
  })



  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema)
  })

  const [preview, setPreview] = useState<string | null>(null)
  const productImage = watch("productImage")

  useEffect(() => {
    if (productImage?.length) {
      const file = productImage[0]
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)

      // Cleanup URL on unmount
      return () => URL.revokeObjectURL(imageUrl)
    }
  }, [productImage])
  
  function onSubmit(data:ProductFormData){
    console.log("PRODUCT form data",data)
    const formData = new FormData()
    formData.append('productImage',data.productImage[0])
    formData.append('title',data.title)
    formData.append('brand',data.brand)
    formData.append('category',data.category)
    formData.append('currency',data.currency)
    formData.append('description',data.description)
    formData.append('price',String(data.price))
    formData.append('salePrice',String(data.salePrice))
    formData.append('totalStock',String(data.totalStock))
    
    mutation.mutate(formData)
    console.log("formData : ",formData)
    reset()
    setPreview(null);
    // const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    // if (fileInput) {
    //   fileInput.value = ""; // Clear file input
    // }
  }
  
  
  

  return (
    <div className='container grid w-full min-h-screen grid-cols-1 p-2 place-items-center bg-dashboard/50'>
        <div className="p-6 mx-auto w-[90%] bg-card/75 text-copy-primary md:w-[60%] rounded-md">
      <h1 className="pb-4 mb-6 text-2xl font-bold text-center border-b-2 border-b-stone-600">Upload New Product</h1>
      {mutation.isError && (
                  <span className="self-center mb-1 text-sm text-red-500 capitalize">Error: {displayMessage?displayMessage:'Unable uplaod product on database. try it again!'}</span>
      )}
      {mutation.isSuccess && (
        <span className="self-center mb-1 text-sm text-lime-500"> {displayMessage}</span>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-4">
        <div className="mb-4 space-y-4">
          <label className="flex items-center gap-2">
            <span className="block mb-1 text-sm font-medium">Product Image (WEBP only)</span>
            <input
              type="file"
              accept="image/webp"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 "
              {...register("productImage")}
            />
            {errors.productImage && (
              <p className="mt-1 text-sm text-red-600">{errors.productImage.message}</p>
            )}
            {preview && (
              <img src={preview} alt="Preview" className="object-cover mt-2 rounded h-28 w-28 " />
            )}
          </label>

          {[
            { name: "title", label: "Title", type: "text" ,placeholder:'Enter product Title'},
            { name: "brand", label: "Brand", type: "text"  ,placeholder:'Enter product brand'},
            { name: "category", label: "Category (comma separated)", type: "text" ,placeholder:'Enter category with comma separated' },
            // { name: "currency", label: "Currency", type: "text" ,placeholder:'Enter currency' },
            // { name: "description", label: "Description", type: "text" ,placeholder:'Enter product description' },
            { name: "price", label: "Price", type: "number"  ,placeholder:'Enter product price'},
            { name: "salePrice", label: "Sale Price", type: "number"  ,placeholder:'Enter product salePrice'},
            { name: "totalStock", label: "Total Stock", type: "number" ,placeholder:'Enter product stock' }
          ].map((field) => (
            <label key={field.name} className="block">
              <span className="block mb-1 text-sm font-medium">{field.label}</span>
              <input
                type={field.type}
                className="block w-full p-1 mt-1 text-black border-gray-300 rounded-md shadow-sm outline-none bg-stone-200 placeholder:text-stone-600 placeholder:font-medium focus:ring-blue-500 focus:border-blue-500 ring-1"
                placeholder={field.placeholder}
                {...register(field.name as keyof ProductFormData)}
              />
              {errors[field.name as keyof ProductFormData] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors[field.name as keyof ProductFormData]?.message}
                </p>
              )}
            </label>
          ))}
          <label className="block">
            <span className="block mb-1 text-sm font-medium">Currency</span>
            <select
              {...register("currency",{required:"Currency is required"})}
              className="block w-full p-2 mt-1 text-black border rounded-md bg-stone-200"
              defaultValue={""}
            >
              <option>-- Select currency --</option>
              <option value="INR">Indian Ruppee</option>
              <option value="USD">US Dollar</option>
              <option value="EUR">Euro</option>
              <option value="GBP">Pound Sterling</option>
              <option value="RUB">Russian Ruble</option>
            </select>
            {errors.currency && <p className="text-sm text-red-500">{errors.currency.message}</p>}
          
          </label>
          <label className="block">
            <span className="block mb-1 text-sm font-medium">Description</span>
            <textarea  rows={10} className="block p-2.5 w-full text-sm text-black bg-stone-200 rounded-lg border border-stone-400 focus:ring-blue-500 focus:border-blue-500 outline-none ring-1 placeholder:text-stone-600 placeholder:font-medium" placeholder="Enter product description ..."
            {...register('description')}
            ></textarea>
          </label>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={`w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center gap-2 ${mutation.isPending? 'cursor-not-allowed opacity-45':''} ${mutation.isError?``:``}`}
        >
          {mutation.isPending && <span>
            <LoaderCircle strokeWidth={2} className="text-bg-cta animate-spin" /></span>}
          {mutation.isError ? 'ReSubmit...' : 'Submit'}
          
        </button>
        
      </form>
    </div>
    <ToastContainer/>
    </div>
  )
}

export default ProductForm