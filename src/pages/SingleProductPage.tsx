import { useMutation, useQuery } from "@tanstack/react-query"
import { deleteSingleProduct, fetchSingleProduct } from "../http/api"
import { useNavigate, useParams } from "react-router-dom"
import SingleProductLoder from "../components/skeleton/SingleProductLoder"
import ReadMoreText from "../components/ReadMoreText"
import { PencilIcon, Trash2 } from "lucide-react"
// import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"
import { Product } from "../types/product"


const SingleProductPage = () => {
    const mutation= useMutation({
        mutationKey:["deleteProduct"],
        mutationFn:deleteSingleProduct,
        onError:()=>{},
        onSuccess:()=>{}
      })
    const {id} = useParams()
    const navigate = useNavigate()
    console.log("product id on single product page ",id)
    console.log(typeof(id))
    if(!id){
        console.log("NO id is found");
        throw new Error("Product ID is missing");
    }
    const {data,isError,isLoading}= useQuery({
        queryKey:["singleProduct",id],
        queryFn:()=>fetchSingleProduct(id)
    })
    // let product: Product
    // if (data){
    //     console.log(data)
    //     product = data.data.productDetail
    // }
    const timeAgo = (date: string) => {
        return   new Date(date).toLocaleString();
      }
    const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency, 
    }).format(price);
    };
    const handleUpdateBtn =(id:string)=>{
        console.log("handleUpdateBtn",id);
    }
    const handleDeleteBtn =(id:string)=>{
        mutation.mutate(id)
    }
    if (isLoading || !data){
        return(
            <div className="container">
                <div className="flex items-center justify-center min-h-screen antialiased text-copy-primary">
                    <SingleProductLoder/>
                </div>
            </div>
        )
    }
    if (isError  ) {
        return (
          <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">
            Error occured while fetching product. Please try again later.
          </div>
        );
      }
      const product: Product = data.data.productDetail;
    
  return (
    <div className="container">
        <div className="flex items-center justify-center min-h-screen antialiased text-copy-primary ">
            {/* {isLoading && (
                <SingleProductLoder/>
            )} */}
            {data && (
                <div className="grid grid-cols-1 gap-8 p-4 rounded-lg shadow-lg md:grid-cols-2 sm:p-6 bg-card/50">
                <div className="flex items-center mx-auto ">
                    <img src={product.image} alt="" className="object-cover w-full"/>
                </div>
                <div className="flex flex-col justify-center p-2 ">
                <h1 className="mb-2 text-4xl font-bold ">{product.title}</h1>
                    <p className="mb-4 text-lg ">{product.brand} </p>
                    <div className="flex flex-col items-center justify-center gap-4 mb-4 md:flex-row md:justify-start">
                            <span className="mr-2 text-2xl font-bold ">Price : {formatPrice(product.price-product.salePrice,product.currency)}</span>
                        {product.salePrice < product.price && (
                            <span className="text-lg line-through">{formatPrice(product.price,product.currency)}</span>
                            
                        )}
                        <span className="ml-4 text-lg text-orange-400 ">{formatPrice(product.salePrice,product.currency)} OFF</span>
                    
                    </div>
                    <ReadMoreText text={product.description}/>
                    {/* <p className="mb-4 ">{product.description}</p> */}
                    <h2 className="mt-2 mb-2 text-lg font-semibold">Categories:</h2>
                <div className="flex flex-wrap gap-2">
                    {product.category.map((cat:string, index:number) => (
                    <span key={index} className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-full">
                        {cat}
                    </span>
                    ))}
                </div>
                <div>
                <div className="mt-10">
                    <p className="mb-2 text-xl"><span className="text-lg font-medium">In stock:</span> {product.totalStock}</p>
                    <p className="text-sm ">Added: {timeAgo(product.createdAt)}</p>
                    <p className="text-sm ">Last updated: {timeAgo(product.updatedAt)}</p>
                </div>
            </div>
                <div className="flex gap-4 mt-4">
                    <button className="flex items-center justify-center gap-1 px-2 text-white bg-sky-500 py-1.5 rounded-lg hover:bg-sky-600"
                    onClick={()=>handleUpdateBtn(product._id)}
                    > 
                        <PencilIcon size={16}/>Update
                    </button>
                    <button className="flex items-center justify-center gap-1 px-2 text-white bg-red-500 py-1.5 rounded-lg hover:bg-red-600"
                        onClick={()=>handleDeleteBtn(product._id)}
                    >
                        <Trash2/>Delete
                    </button>
                </div>
                </div>
                </div>
                
            )}
        </div>
    </div>
  )
}

export default SingleProductPage

//  p-4 mx-auto antialiased sm:p-6 lg:p-8 md:pt-12 lg:pt-16 
