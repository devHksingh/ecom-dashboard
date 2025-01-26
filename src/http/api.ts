import axios from "axios";


const api = axios.create({
    baseURL:import.meta.env.VITE_PUBLIC_BACKEND_URL,
    headers:{
        'Content-Type':'application/json'
    }
})


// api call for login

export const login = async(data:{email:string;password:string})=>{
    return api.post('/api/v1/users/login',data)
}

export const registerUser = async (data:{email:string;password:string;name:string;confirmPassword:string})=>{
    return api.post('/api/v1/users/register',data)
}