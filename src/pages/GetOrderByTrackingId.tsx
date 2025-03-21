import { useQuery } from "@tanstack/react-query";
import  { FormEvent, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getOrderByTrackingId } from "../http/api";
import { AxiosError } from "axios";

 interface OrderProps{
    productDetail:{
        name:string,
        price:number,
        imageUrl:string,
        productId:string,
        currency:string,
    },
    userDetails:{
        userName:string,
        userEmail:string,
    },
    _id:string,
    orderStatus:string,
    orderPlaceOn:string,
    trackingId:string,
    totalPrice:number,
    quantity:number,
    createdAt:string,
    updatedAt:string,
    __v:number,
    
}
const GetOrderByTrackingId = () => {
    const [trackingId,setTrackingId] = useState("")
    const [submitted, setSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [order, setOrder] = useState<OrderProps>();
    // const navigate = useNavigate()

    const {data,isLoading,isError,error } = useQuery({
        queryKey:["GetOrderByTrackingId",trackingId],
        queryFn:()=>getOrderByTrackingId(trackingId),
        enabled:submitted && !!trackingId
    })
    useEffect(()=>{
      if(error){
        const err = error as AxiosError<{ message: string }>
        setErrorMsg((err.response?.data.message)||"We couldn't find an order with that tracking ID. Please check and try again.")
      }
    },[error])

    const handelSubmit=(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if(trackingId){
            setTrackingId(trackingId.trim())
            setSubmitted(true)
        }
    }
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
    const getStatusColor = (status:string) => {
        switch (status) {
          case 'PROCESSED':
            return 'bg-red-100 text-red-800';
          case 'SHIPPED':
            return 'bg-purple-100 text-purple-800';
          case 'DELIVERED':
            return 'bg-green-100 text-green-800';
        
          default:
            return 'bg-gray-100 text-gray-800';
        }
    };
    

    useEffect(()=>{
        if(data){
            console.log("data",data.order);
            const order:OrderProps = data.order[0]
            console.log("order",order);
            setOrder(order)
        }
    },[data])

return (
    <div className="container p-6 mx-auto">
        <div className="p-6 mx-auto bg-gray-100 rounded-lg shadow-md max-w-8xl">
            <h1 className="mb-6 text-2xl font-bold">Track  Order</h1>
            {/* form for input orderid */}
            <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
                <form onSubmit={handelSubmit} className="flex flex-col items-center gap-3 md:flex-row">
                    <div className="flex-grow">
                        <label htmlFor="orderId">Order Tracking ID</label>
                        <input 
                        type="text"
                        id="orderId"
                        placeholder="Enter your tracking ID (e.g., ORD-XXXX-XXXX-XXXX)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={trackingId}
                        onChange={(e)=>setTrackingId(e.target.value)}
                        required
                        />
                    </div>
                    <div className="self-end">
                        <button
                        type="submit"
                        className="w-full px-6 py-2 text-white bg-blue-600 rounded-md md:w-auto hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                        Track Order
                        </button>
                    </div>
                </form>
            </div>
            {submitted &&(
                <div className="mt-6">
                    {isLoading && (
                        <div className="py-8 text-center">
                        <div className="w-12 h-12 mx-auto border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">Loading order details...</p>
                        </div>
                    )}
                    {isError && (
                        <div className="p-4 border-l-4 border-red-500 rounded-md bg-red-50">
                        <div className="flex">
                            <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            </div>
                            <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error finding your order</h3>
                            <p className="mt-1 text-sm text-red-700">
                                {errorMsg}
                            </p>
                            </div>
                        </div>
                        </div>
                    )}
                    {order && (
                        <div className="text-black">
                            <div className="overflow-hidden bg-white rounded-lg shadow-md">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                              <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                              <p className="mt-1 text-sm text-gray-600">Tracking ID: {order.trackingId}</p>
                            </div>
              
                            <div className="p-6">
                              <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Order Information</h3>
                                  <div className="mt-2 space-y-2">
                                    <p className="text-sm text-gray-800">
                                      <span className="font-medium">Order Date:</span> {formatDate(order.orderPlaceOn)}
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      <span className="font-medium">Total Amount:</span> {formatPrice(order.totalPrice,order.productDetail.currency)}
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      <span className="font-medium">Quantity:</span> {order.quantity}
                                    </p>
                                    <div className="text-sm text-gray-800">
                                      <span className="font-medium">Status:</span>{' '}
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                      </span>
                                      <Link to={`/dashboard/order/singleOrder/${order._id}`} className="w-full px-6 py-2 ml-2 text-white bg-indigo-600 rounded-md md:w-auto hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Update Order Status</Link>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                                  <div className="mt-2 space-y-2">
                                    <p className="text-sm text-gray-800">
                                      <span className="font-medium">Name:</span> {order.userDetails.userName}
                                    </p>
                                    <p className="text-sm text-gray-800">
                                      <span className="font-medium">Email:</span> {order.userDetails.userEmail}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="pt-6 border-t border-gray-200">
                                <h3 className="mb-4 text-sm font-medium text-gray-500">Product Details</h3>
                                
                                <div className="flex flex-col items-center md:flex-row">
                                  <div className="flex-shrink-0 w-24 h-24 overflow-hidden bg-gray-100 rounded-md">
                                    {order.productDetail.imageUrl ? (
                                      <img 
                                        src={order.productDetail.imageUrl} 
                                        alt={order.productDetail.name}
                                        className="object-cover w-full h-full"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center w-full h-full bg-gray-200">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex-grow mt-4 md:ml-6 md:mt-0">
                                    <h4 className="text-lg font-medium text-gray-900">{order.productDetail.name}</h4>
                                    <p className="mt-1 text-sm text-gray-500">Product ID: {order.productDetail.productId}</p>
                                    <p className="mt-1 text-sm text-gray-500">Unit Price: {formatPrice(order.productDetail.price, order.productDetail.currency)}</p>
                                    <p className="mt-1 text-sm text-gray-500">Currency: {order.productDetail.currency}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
              
                        </div>
            
                        </div>
                    )}
                    
                </div>
            )}
        </div>
    </div>
  );
}


export default GetOrderByTrackingId