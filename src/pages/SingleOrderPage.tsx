import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getSingleOrder } from "../http/api"
import SingleProductLoder from "../components/skeleton/SingleProductLoder"
import { ArrowLeft, Calendar, CreditCard, Package, Truck, User } from "lucide-react"


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
    const getStatusColor = (status:string) => {
        switch (status) {
          case 'PROCESSED':
            return 'bg-red-100 text-red-800';
          case 'SHIPPED':
            return 'bg-purple-100 text-purple-800';
          case 'DELIVERED':
            return 'bg-green-100 text-green-800';
        //   case 'CANCELLED':
        //     return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };
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
    <div className="container px-4 py-6 mx-auto bg-stone-200">
    {/* Back button and order ID */}
        <div className="flex items-center mb-6">
        <Link to={'/dashboard/order'} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Orders</span>
        </Link>
        <div className="flex items-center ml-auto">
            <span className="mr-2 text-gray-500">Order ID:</span>
            <span className="font-medium">{data.order.trackingId}</span>
        </div>
        </div>

        {/* Order overview card */}
        <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
            <div>
            <h1 className="text-2xl font-semibold text-gray-800">Order Details</h1>
            <p className="mt-1 text-gray-500">Placed on {formatDate(data.order.orderPlaceOn)}</p>
            </div>
            <div className="mt-4 md:mt-0">
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.order.orderStatus)}`}>
                {data.order.orderStatus}
            </span>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Customer Information */}
            <div className="p-4 rounded-lg bg-gray-50">
            <h2 className="flex items-center mb-4 text-lg font-medium text-gray-800">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                Customer Information
            </h2>
            <div className="space-y-2">
                <div className="flex items-start">
                <span className="w-24 text-gray-600">Name:</span>
                <span className="font-medium">{data.order.userDetails.userName}</span>
                </div>
                <div className="flex items-start">
                <span className="w-24 text-gray-600">Email:</span>
                <span className="font-medium">{data.order.userDetails.userEmail}</span>
                </div>
                {/* <div className="flex items-start">
                <span className="w-24 text-gray-600">Address:</span>
                <span className="font-medium">{orderData.userDetails.address}</span>
                </div> */}
            </div>
            </div>

            {/* Order Information */}
            <div className="p-4 rounded-lg bg-gray-50">
            <h2 className="flex items-center mb-4 text-lg font-medium text-gray-800">
                <Package className="w-5 h-5 mr-2 text-gray-500" />
                Order Information
            </h2>
            <div className="space-y-2">
                <div className="flex items-start">
                <span className="w-32 text-gray-600">Payment Method:</span>
                <span className="flex items-center font-medium">
                    <CreditCard className="w-4 h-4 mr-1 text-gray-500" />
                    {/* {orderData.paymentMethod} */}
                    COD (Cash On Deleviery)
                </span>
                </div>
                <div className="flex items-start">
                <span className="w-32 text-gray-600">Shipping Method:</span>
                <span className="flex items-center font-medium">
                    <Truck className="w-4 h-4 mr-1 text-gray-500" />
                    {/* {orderData.shipping.method} */}
                    Standard Shipping
                </span>
                </div>
                {/* <div className="flex items-start">
                <span className="w-32 text-gray-600">Estimated Delivery:</span>
                <span className="flex items-center font-medium">
                    <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                    {orderData.shipping.estimatedDelivery}
                </span>
                </div> */}
            </div>
            </div>
        </div>
        </div>

        {/* Order Items */}
        <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-gray-800">Order Items</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr className="bg-gray-50">
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Product</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Unit Price</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Quantity</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Total</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                
                <tr >
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded">
                        <img src={data.order.productDetail.imageUrl} alt={data.order.productDetail.name} className="object-cover object-center w-full h-full" />
                        </div>
                        <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{data.order.productDetail.name}</div>
                        {/* <div className="text-sm text-gray-500">SKU: {item.id.substring(0, 8)}</div> */}
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                    {formatPrice(data.order.productDetail.price,data.order.productDetail.currency)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                    {data.order.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                    {formatPrice(data.order.totalPrice,data.order.productDetail.currency)}
                    </td>
                </tr>
                
            </tbody>
            </table>
        </div>
        </div>

        {/* Order Summary */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-gray-800">Order Summary</h2>
        <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(data.order.totalPrice,data.order.productDetail.currency)}</span>
            </div>
            <div className="flex justify-between py-2">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">{formatPrice(Math.round(0.08*(data.order.totalPrice)),data.order.productDetail.currency)}</span>
            </div>
            <div className="flex justify-between py-2">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">{formatPrice(Math.round(0.18*(data.order.totalPrice)),data.order.productDetail.currency)}</span>
            </div>
            <div className="flex justify-between py-3 mt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-lg font-semibold text-gray-900">{formatPrice((data.order.totalPrice+Math.round(0.08*(data.order.totalPrice))+Math.round(0.18*(data.order.totalPrice))),data.order.productDetail.currency)}</span>
            </div>
        </div>
        </div>
    </div>
    // <div className="container">
    //     <div className="flex items-center justify-center min-h-screen antialiased text-copy-primary ">
    //     {data && (
    //             <div className="grid grid-cols-1 gap-8 p-4 rounded-lg shadow-lg md:grid-cols-2 sm:p-6 bg-card/50">
    //             <div className="flex items-center mx-auto ">
    //                 <img src={data.order.productDetail.imageUrl} alt={data.order.productDetail.name} className="object-cover w-full"/>
    //             </div>
    //             <div className="flex flex-col justify-center p-2 ">
    //             <h1 className="mb-2 text-4xl font-bold ">{data.order.productDetail.name}</h1>
    //                 <p className="mb-4 text-sm text-copy-primary/60"><span className="font-bold capitalize ">trackingId:</span> {data.order.trackingId} </p>
    //                 <div className="flex flex-col items-center justify-center gap-4 mb-4 md:flex-row md:justify-start">
    //                         <span className="mr-2 text-2xl font-bold "> Unit Price : {formatPrice(data.order.productDetail.price,data.order.productDetail.currency)}</span>
                        
    //                     <span className="ml-4 text-lg text-orange-400 ">Total Qty: {data.order.quantity} </span>
    //                     <span className="ml-4 text-lg text-orange-400 ">Total Price{formatPrice(data.order.totalPrice,data.order.productDetail.currency)} OFF</span>
                    
    //                 </div>

    //                 <div className="flex flex-col justify-between ">
    //                     <h2 className="text-lg font-medium capitalize ">user details</h2>
    //                     <div>
    //                         <p>Name: <span className="capitalize ">{data.order.userDetails.userName}</span></p>
    //                         <p>Email: <span className="">{data.order.userDetails.userEmail}</span></p>
    //                     </div>
    //                 </div>
    //                 <div>
    //                     <h2>Product details</h2>
    //                     <div>
    //                         <p>Unit Price: <span className="capitalize ">{data.order.userDetails.userName}</span></p>
    //                         <p>Qty: <span className="">{data.order.quantity}</span></p>
    //                         <p>Total Price: <span className="">{data.order.userDetails.userEmail}</span></p>
    //                     </div>
    //                 </div>
                    
    //                 {/* <p className="mb-4 ">{product.description}</p> */}
    //                 <h2 className="mt-2 mb-2 text-lg font-semibold">Categories:</h2>
    //             <div className="flex flex-wrap gap-2">
    //                 <span>User details</span>
    //                 <h2>Name: {data.order.userDetails.userName}</h2>
    //                 <h2>email: {data.order.userDetails.userEmail}</h2>
    //             </div>
    //             <div>
    //             <div className="mt-10">
    //                 <p className="mb-2 text-xl"><span className="text-lg font-medium">orderStatus:</span> {data.order.orderStatus}</p>
    //                 <p className="text-sm ">orderPlaceOn: {formatDate(data.order.orderPlaceOn)}</p>
    //                 {/* <p className="text-sm ">Last updated: {formatDate(data.updatedAt)}</p> */}
    //             </div>
    //         </div>
    //             {/* <div className="flex gap-4 mt-4">
    //                 <button className="flex items-center justify-center gap-1 px-2 text-white bg-sky-500 py-1.5 rounded-lg hover:bg-sky-600"
    //                 onClick={()=>handleUpdateBtn(product._id)}
    //                 > 
    //                     <PencilIcon size={16}/>Update
    //                 </button>
    //                 <button className="flex items-center justify-center gap-1 px-2 text-white bg-red-500 py-1.5 rounded-lg hover:bg-red-600"
    //                     onClick={()=>handleDeleteBtn(product._id)}
    //                 >
    //                     <Trash2/>Delete
    //                 </button>
    //             </div> */}
    //             </div>
    //             </div>
                
    //         )}
    //     </div>
    // </div>
  )
}

export default SingleOrderPage