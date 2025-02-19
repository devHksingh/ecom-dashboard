import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchSingleProduct, logoutUser, updateProduct } from "../http/api"
import { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify'
import { useDispatch } from "react-redux"
import { deleteUser, updateAccessToken } from "../features/auth/authSlice"

// Define the product schema with  validation
const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(4, "Brand is required and must be at least 4 characters"),
  category: z.string().min(1, "Category is required"),
  currency: z.string().min(1, "Currency is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().nonnegative("Sale price must be zero or positive"),
  totalStock: z.number().int().nonnegative("Stock must be zero or positive"),
  productImage: z.instanceof(FileList).optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ErrorResponse {
  message: string;
}

const ProductEditForm = () => {
  const [preview, setPreview] = useState<string | null>(null)
  const [oldImg, setOldImg] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const dispatch = useDispatch()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  if (!id) {
    throw new Error("Product ID is missing")
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
    setValue,
    
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      brand: "",
      category: "",
      currency: "",
      description: "",
      productImage: undefined,
      price: 0,
      salePrice: 0,
      totalStock: 0,
    }
  })

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["singleProduct", id],
    queryFn: () => fetchSingleProduct(id),
    enabled: !!id
  })

  const mutation = useMutation({
    mutationFn: (values: ProductFormValues) => {
      const formData = new FormData()
      
      // Handle image if provided
      if (values.productImage && values.productImage.length > 0) {
        formData.append('productImage', values.productImage[0]);
      }
      console.log("values.category : ",values.category);
      

      // Append other form values
      formData.append('title', values.title)
      formData.append('brand', values.brand)
      // formData.append('category', values.category.join(' ')) // Join array back to string
      formData.append('category',values.category)
      formData.append('currency', values.currency)
      formData.append('description', values.description)
      formData.append('price', String(values.price))
      formData.append('salePrice', String(values.salePrice))
      formData.append('totalStock', String(values.totalStock))

      return updateProduct(id, formData)
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["singleProduct", id] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success('Product updated successfully',{position:'top-right'})
      const {isAccessTokenExp,accessToken}= response.data
      if(isAccessTokenExp){
        dispatch(updateAccessToken(accessToken))
        const userSessionData = JSON.parse(sessionStorage.getItem('user') || `{}`)
        userSessionData.accessToken = accessToken
        sessionStorage.removeItem('user')
        sessionStorage.setItem('user',JSON.stringify(userSessionData))
      }
      navigate("/dashboard/product/allProducts")
    },
    onError: async(err: AxiosError<ErrorResponse>) => {
      const message = err.response?.data?.message || "Error while updating product"
      console.log("onerror : ",err)
      setErrorMessage(message)
      toast.error(message)
      
      // logout user if token exprie
      if(err.response?.status === 401){
        console.log("err.response?.status :",err.response?.status);
        
        dispatch(deleteUser())
        sessionStorage.clear()
        await logoutUser()
        navigate('/dashboard/auth/login')
      }
    }
  })

  useEffect(() => {
    if (data?.data?.productDetail) {
      const product = data.data.productDetail 
      setOldImg(product.image)
      const categoryValue = Array.isArray(product.category) 
        ? product.category.join(',') 
        : product.category
      
      // Set form values
      setValue("title", product.title)
      setValue("brand", product.brand)
      // setValue("category", product.category )
      setValue("category", categoryValue)
      setValue("currency", product.currency)
      setValue("description", product.description)
      setValue("price", product.price)
      setValue("salePrice", product.salePrice)
      setValue("totalStock", product.totalStock)
    }
  }, [data, setValue])

  const onSubmit = (values: ProductFormValues) => {
    mutation.mutate(values)
  }

  const productImage = watch("productImage")
  useEffect(() => {
    if (productImage?.length) {
      const file = productImage[0]
      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
      return () => URL.revokeObjectURL(imageUrl)
    }
  }, [productImage])

  if (isError) {
    const axiosError = error as AxiosError<ErrorResponse>
    const errorMessage = axiosError.response?.data?.message || "Error loading product"
    return (
      <div className="p-4 text-4xl font-bold text-center text-red-600 bg-red-100 rounded-md">
        {errorMessage}
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center p-8 text-xl bg-gray-100 animate-pulse">
        Loading product data...
      </div>
    )
  }

  return (
    <div className="container p-6 mx-auto">
      <div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>

        {errorMessage && (
          <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Title field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Product Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Brand field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Brand
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("brand")}
              />
              {errors.brand && (
                <p className="text-sm text-red-600">{errors.brand.message}</p>
              )}
            </div>

            {/* Category field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Categories (comma separated)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., electronics,computers,accessories"
                {...register("category")}
              />
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Currency field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                {...register("currency")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select currency --</option>
                <option value="INR">Indian Rupee</option>
                <option value="USD">US Dollar</option>
                <option value="EUR">Euro</option>
                <option value="GBP">Pound Sterling</option>
                <option value="RUB">Russian Ruble</option>
              </select>
              {errors.currency && (
                <p className="text-sm text-red-600">{errors.currency.message}</p>
              )}
            </div>

            {/* Price fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Sale Price
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("salePrice", { valueAsNumber: true })}
              />
              {errors.salePrice && (
                <p className="text-sm text-red-600">{errors.salePrice.message}</p>
              )}
            </div>

            {/* Stock field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Total Stock
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("totalStock", { valueAsNumber: true })}
              />
              {errors.totalStock && (
                <p className="text-sm text-red-600">{errors.totalStock.message}</p>
              )}
            </div>

            {/* Image upload field */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Image (webp only - optional)
                </label>
                <input
                  type="file"
                  accept="image/webp"
                  className="block w-[60%] text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  {...register("productImage")}
                />
                {preview && (
                  <img src={preview} alt="Preview" className="rounded object-fit h-28 w-28" />
                )}
              </div>
              {errors.productImage && (
                <p className="text-sm text-red-600">{errors.productImage.message}</p>
              )}
            </div>

            {/* Show old image */}
            {oldImg && (
              <div className="md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Current Image</span>
                <img
                  src={oldImg}
                  alt="Current product"
                  className="mt-2 rounded-md h-28 w-28 object-fit"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.png'
                  }}
                />
              </div>
            )}

            {/* Description field */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Form actions */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/product")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isDirty || isSubmitting || mutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ProductEditForm