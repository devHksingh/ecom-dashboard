export interface OrderTableProps {
    productDetail:{
        name:string,
        price:number,
        imageUrl:string,
        productId:string,
        currency:string
    },
    userDetails:{
        userName:string,
        userEmail:string
    },
    _id:string,
    orderStatus:string,
    orderPlaceOn:string,
    trackingId:string,
    totalPrice:number,
    quantity:number,
}

export interface OrderBoughtItem{
    name:string,
    value:{
        quantity:number,
        price:number,
        url:string,
    },

}

