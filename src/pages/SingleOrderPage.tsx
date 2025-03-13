import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { getSingleOrder } from "../http/api"
import SingleProductLoder from "../components/skeleton/SingleProductLoder"


const SingleOrderPage = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    if(!id){
        navigate('/dashboard/order')
        throw new Error("order ID is missing");
    }
    const {data,isLoading,isError} = useQuery({
        queryKey:["singleOrder",id],
        queryFn:()=>getSingleOrder(id)
    })

    const formatDate = (dateString:string)=>{
        const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    }
    const formatPrice = (amount:number,currency:string)=>{
        let price 
        switch (currency){
            case "USD":{
                price = `$ ${amount}`
                // return price
                break
            }
            case "INR":{
                price = `₹ ${amount}`
                break
            }  
            case "RUB":{
                price = `₽ ${amount}`
                break
            }  
            case "GBP":{
                price = `£ ${amount}`
                break
            }  
            case "EUR":{
                price = `€ ${amount}`
                break
            } 
            default:
                price = `₹ ${amount}`
                break
        }
        return price
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
            Error occured while fetching order. Please try again later.
          </div>
        );
      }
      if(data){
        console.log("singleorder",data);
        
      }
  return (
    <div className="container">
        <div className="flex items-center justify-center min-h-screen antialiased text-copy-primary ">
        {data && (
                <div className="grid grid-cols-1 gap-8 p-4 rounded-lg shadow-lg md:grid-cols-2 sm:p-6 bg-card/50">
                <div className="flex items-center mx-auto ">
                    <img src={data.order.productDetail.imageUrl} alt={data.order.productDetail.name} className="object-cover w-full"/>
                </div>
                <div className="flex flex-col justify-center p-2 ">
                <h1 className="mb-2 text-4xl font-bold ">{data.order.productDetail.name}</h1>
                    <p className="mb-4 text-lg ">trackingId: {data.order.trackingId} </p>
                    <div className="flex flex-col items-center justify-center gap-4 mb-4 md:flex-row md:justify-start">
                            <span className="mr-2 text-2xl font-bold "> Unit Price : {formatPrice(data.order.productDetail.price,data.order.productDetail.currency)}</span>
                        {/* {product.salePrice < product.price && (
                            <span className="text-lg line-through">{formatPrice(product.price,product.currency)}</span>
                            
                        )} */}
                        <span className="ml-4 text-lg text-orange-400 ">Total Qty: {data.order.quantity} </span>
                        <span className="ml-4 text-lg text-orange-400 ">Total Price{formatPrice(data.order.totalPrice,data.order.productDetail.currency)} OFF</span>
                    
                    </div>
                    
                    {/* <p className="mb-4 ">{product.description}</p> */}
                    <h2 className="mt-2 mb-2 text-lg font-semibold">Categories:</h2>
                <div className="flex flex-wrap gap-2">
                    <span>User details</span>
                    <h2>Name: {data.order.userDetails.userName}</h2>
                    <h2>email: {data.order.userDetails.userEmail}</h2>
                </div>
                <div>
                <div className="mt-10">
                    <p className="mb-2 text-xl"><span className="text-lg font-medium">orderStatus:</span> {data.orderStatus}</p>
                    <p className="text-sm ">orderPlaceOn: {formatDate(data.order.orderPlaceOn)}</p>
                    {/* <p className="text-sm ">Last updated: {formatDate(data.updatedAt)}</p> */}
                </div>
            </div>
                {/* <div className="flex gap-4 mt-4">
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
                </div> */}
                </div>
                </div>
                
            )}
        </div>
    </div>
  )
}

export default SingleOrderPage