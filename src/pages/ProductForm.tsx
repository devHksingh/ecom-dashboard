import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const productSchema = z.object({
  productImage: z.instanceof(FileList).refine((files)=>files.length ===1,{message:"Only single product image is required"}),
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  currency: z.string().min(1, "Currency is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  salePrice: z.coerce.number().positive("Sale price must be greater than 0"),
  totalStock: z.coerce.number().int().nonnegative("Stock must be a non-negative integer")
})

type ProductFormData = z.infer<typeof productSchema>

const ProductForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
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

  const onSubmit = async (data: ProductFormData) => {
    try {
      console.log(data)
      // Add your submission logic here
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div className='container grid w-full min-h-screen grid-cols-1 place-items-center bg-dashboard/50'>
        <div className="p-6 mx-auto w-[90%] bg-card/75 text-copy-primary md:w-[60%] rounded-md">
      <h1 className="pb-4 mb-6 text-2xl font-bold text-center border-b-2 border-b-stone-600">Upload New Product</h1>
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
              <img src={preview} alt="Preview" className="object-cover w-32 h-32 mt-2 rounded " />
            )}
          </label>

          {[
            { name: "title", label: "Title", type: "text" ,placeholder:'Enter product Title'},
            { name: "brand", label: "Brand", type: "text"  ,placeholder:'Enter product brand'},
            { name: "category", label: "Category", type: "text" ,placeholder:'Enter category' },
            { name: "currency", label: "Currency", type: "text" ,placeholder:'Enter currency' },
            { name: "description", label: "Description", type: "text" ,placeholder:'Enter product description' },
            { name: "price", label: "Price", type: "number"  ,placeholder:'Enter product price'},
            { name: "salePrice", label: "Sale Price", type: "number"  ,placeholder:'Enter product salePrice'},
            { name: "totalStock", label: "Total Stock", type: "number" ,placeholder:'Enter product stock' }
          ].map((field) => (
            <label key={field.name} className="block">
              <span className="block mb-1 text-sm font-medium">{field.label}</span>
              <input
                type={field.type}
                className="block w-full p-1 mt-1 text-black border-gray-300 rounded-md shadow-sm outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-stone-200 placeholder:text-stone-600 placeholder:font-medium"
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
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
    </div>
  )
}

export default ProductForm