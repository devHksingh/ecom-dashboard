import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchSingleProduct, updateProduct } from "../http/api"
import { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { Product } from "../types/product"

// Define the product schema
 const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  currency: z.string().min(1, "Currency is required"),
  description: z.string().min(1, "Description is required"),
  // image: z.string().url("Must be a valid URL"),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().positive("Sale price must be positive"),
  totalStock: z.number().int().nonnegative("Stock must be zero or positive"),
  productImage: z.instanceof(FileList).refine((files)=>files.length ===1,{message:"Only single product image is required"}),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ErrorResponse {
  message: string;
}

const ProductEditForm = () => {
  const [preview, setPreview] = useState<string | null>(null)
  const [oldImg,setOldImg] = useState<string | null>("")
  const { id } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // For TypeScript
  if (!id) {
    console.log("No id is found")
    throw new Error("Product ID is missing")
  }

  // Set up the form with validation
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
    setValue
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      brand: "",
      category: [],
      currency: "",
      description: "",
      // image: "",
      productImage:undefined,
      price: 0,
      salePrice: 0,
      totalStock: 0,
    }
  })

  // Fetch product data
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["singleProduct", id],
    queryFn: () => fetchSingleProduct(id),
    enabled: !!id
  })

  // Update product mutation
  const mutation = useMutation({
    mutationFn: (values: ProductFormValues) => updateProduct(id, values),
    onSuccess: () => {
      // Invalidate and refetch the product query to update the UI
      queryClient.invalidateQueries({ queryKey: ["singleProduct", id] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
      navigate("/dashboard/product") // Navigate back to product list
    }
  })

  // Populate form when data is loaded
  useEffect(() => {
    if (data?.data?.productDetail) {
      const product = data.data.productDetail as Product
      setOldImg(product.image)
      // Set each form field
      setValue("title", product.title)
      setValue("brand", product.brand)
      setValue("category", Array.isArray(product.category) ? product.category : [product.category])
      setValue("currency", product.currency)
      setValue("description", product.description)
      // setValue("image", product.image)
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

      // Cleanup URL on unmount
      return () => URL.revokeObjectURL(imageUrl)
    }
  }, [productImage])

  if (isError) {
    const axiosError = error as AxiosError<ErrorResponse>
    const errorMessage =
      axiosError.response?.data?.message || "Something went wrong! Error loading product. Please try again later or refresh the page"

    return (
      <div className="p-4 text-4xl font-bold text-center text-red-600 bg-red-100 rounded-md">
        {errorMessage}
      </div>
    )
  }

  if (isLoading || !data) {
    return <div className="flex items-center justify-center p-8 text-xl bg-gray-100 animate-pulse">Loading product data...</div>
  }

  return (
    <div className="container p-6 mx-auto">
      <div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>

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

            {/* Category field - assuming it's a comma-separated input for simplicity */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Categories (comma separated)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("category")}
                onChange={(e) => {
                  const categories = e.target.value.split(' ').map(cat => cat.trim()).filter(Boolean)
                  setValue("category", categories)
                }}
                defaultValue={data?.data?.productDetail?.category?.join(' ')}
                
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
              {/* <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("currency")}
              />
              {errors.currency && (
                <p className="text-sm text-red-600">{errors.currency.message}</p>
              )} */}
              <select
              {...register("currency",{required:"Currency is required"})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            </div>

            {/* Price field */}
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

            {/* Sale Price field */}
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

            {/* Total Stock field */}
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

            {/* Image URL field */}
            <div className="space-y-2 md:col-span-2">
              
              <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-gray-700">
                Image (webp only)
              </label>
              <input
              type="file"
              accept="image/webp"
              className="block w-[60%] text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 "
              {...register("productImage")}
            />
              {preview && (
              <img src={preview} alt="Preview" className="rounded object-fit h-28 w-28" />
              )}
              </div>
              
              {errors.productImage && (
              <p className="mt-1 text-sm text-red-600">{errors.productImage.message}</p>
            )}
              
              
            </div>
            
            <div>
            {oldImg && (
                <div className="mt-2 space-y-2">
                <span className="text-sm font-medium text-gray-700">Old uploaded Image</span>
                  <img
                    src={oldImg}
                    alt="Old image Product preview"
                    className="rounded-md h-28 w-28 object-fit"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.png'
                    }}
                  />
                </div>
              )}
            </div>

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

          {mutation.isError && (
            <div className="p-3 mt-4 text-sm text-red-600 bg-red-100 rounded-md">
              Error updating product: {(mutation.error as AxiosError<ErrorResponse>)?.response?.data?.message || "Something went wrong"}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ProductEditForm