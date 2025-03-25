import axios from "axios";
import { store } from "../app/store";

const api = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const state = store.getState();
    const { accessToken, refreshToken } = state.auth;
    let sessionAccessToken
    let sessionRefreshToken
    // add logic for insert  sessionToken inplace of stateToken if !token not found
    console.log("accessToken, refreshToken", accessToken, refreshToken);
    if (!accessToken) {
        const userSessionData = JSON.parse(sessionStorage.getItem('user') || `{}`)
        sessionAccessToken = userSessionData.accessToken
        sessionRefreshToken = userSessionData.refreshToken

        console.log("sessionAccessToken", sessionAccessToken)
    }
    if (accessToken && refreshToken) {
        config.headers.Authorization = accessToken;
        config.headers.refreshToken = refreshToken;
    } else {
        config.headers.Authorization = sessionAccessToken;
        config.headers.refreshToken = sessionRefreshToken;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// api call for login

export const login = async (data: { email: string; password: string }) => {
    return api.post('/api/v1/users/login', data)
}

export const registerUser = async (data: { email: string; password: string; name: string; confirmPassword: string }) => {
    return api.post('/api/v1/users/register', data)
}

// api call for post product data
export const createProduct = async (data: FormData) => {
    return api.post('/api/v1/products/register', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// api  call for fetch all product list by limit and skip

export const fetchProductsWithLimit = async (limit = 10, skip = 0) => {
    return api.get('/api/v1/products/getAllProductsWithLimits', {
        params: { limit, skip }
    })
}

export const fetchAllProductCategory = async () => {
    return api.get('/api/v1/products/getAllCategoryName')
}

export const fetchProductByCategoryWithLimit = async (data: { limit: number, skip: number, category: string[] }) => {
    return api.post('/api/v1/products/getProductByCategoryWithLimit', data)
}

// get single product 

export const fetchSingleProduct = async (id: string) => {
    return api.get(`/api/v1/products/${id}`)
}

// delete single product

export const deleteSingleProduct = async (id: string) => {
    return api.delete(`/api/v1/products/${id}`)
}
// update single product
export const updateProduct = async (id: string, data: FormData) => {
    console.log("product id ", id)
    console.log(data)
    return api.patch(`/api/v1/products/update/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// logout api

export const logoutUser = async () => {
    return api.get('/api/v1/users/logout')
}

// getallUser

export const allUser = async (limit = 10, skip = 0) => {
    return api.get('/api/v1/users/admin/getAlluserWithLimt', {
        params: { limit, skip }
    })
}

export const forcedLogout = async () => {
    const userSessionData = JSON.parse(sessionStorage.getItem('user') || `{}`)
    console.log("userSessionData ---------------", userSessionData);

    const userId = userSessionData.id
    console.log("UserID IN API : ", userId)
    const data = { userId: userId }
    console.log("UserID IN API : ", data)
    const response = await api.post('/api/v1/users/forcedLogout', data);
    console.log("Logout response : ", response)


    return response;
}
// api for get all order details

export const getAllOrders = async (limit = 5, skip = 0) => {
    const response = await api.get('/api/v1/orders/getAllOrderByLimitAndSkip', {
        params: { limit, skip }
    })
    console.log(response)
    return response.data
}

export const getgraphData = async (year = 2025) => {
    const data = { year }
    const response = await api.post('/api/v1/orders/getgraphData', data)
    return response.data
}

export const getSingleOrder = async (id: string) => {
    const response = await api.get(`/api/v1/orders/${id}`)
    return response.data
}

// update orderStatus
export const updateOrderStatus = async (trackingId: string, orderStatus: string) => {
    const data = {
        trackingId,
        orderStatus
    }
    const response = await api.post(`/api/v1/orders/updateOrderStatus`, data)
    return response
}
// getOrderByTrackingId
export const getOrderByTrackingId = async (trackingId: string) => {
    const res = await api.get(`/api/v1/orders/getOrderByTrackingId/${trackingId}`)
    return res.data
}

// get userInfo
export const getuser = async() =>{
    const response = await api.get('/api/v1/users/getuser')
    return response.data
}
// change password
export const changePassword = async(data: { oldPassword: string; password: string,confirmPassword:string })=>{
    console.log("api ",data);
    
    const response = await api.post('/api/v1/users/changePassword',data)
    return response.data
}