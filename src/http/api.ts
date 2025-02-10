import axios from "axios";
import { store } from "../app/store";

const api = axios.create({
    baseURL:import.meta.env.VITE_PUBLIC_BACKEND_URL,
    headers:{
        'Content-Type':'application/json'
    }
})

api.interceptors.request.use((config) => {
    const state = store.getState();
    const { accessToken, refreshToken } = state.auth;

    if (accessToken && refreshToken) {
        config.headers.Authorization = accessToken;
        config.headers.refreshToken = refreshToken;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// api call for login

export const login = async(data:{email:string;password:string})=>{
    return api.post('/api/v1/users/login',data)
}

export const registerUser = async (data:{email:string;password:string;name:string;confirmPassword:string})=>{
    return api.post('/api/v1/users/register',data)
}

// api call for post product data
export const createProduct = async(data:FormData)=>{
    api.post('/api/v1/products/register',data,{
        headers:{
            'Content-Type':'multipart/form-data'
        }
    })
}


