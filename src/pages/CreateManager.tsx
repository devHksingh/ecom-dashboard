import { useMutation } from "@tanstack/react-query"
import { createManager } from "../http/api"
import { useForm } from "react-hook-form"
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../hooks/useAuth";

interface FormFields{
    name:string,
    email:string,
    password:string,
    confirmPassword:string
}
interface ErrorResponse{
    message:string
  }
const schema = z.object({
    name:z.string().trim().min(1,{message:'Name is required'}),
    email:z.string().email().trim().min(1,{message:'email is required'}),
    password:z.string().trim().min(6,{message:'password is required'}),
    confirmPassword:z.string().trim().min(6,{message:'confirmPassword is required'}),
}).refine((data)=> data.password === data.confirmPassword,{
    message:"Passwords don't match",
    path:["confirmPassword"]
}
)

const CreateManager = () => {
    const [errMsg,setErrMsg] = useState("")
    useAuth()
    const mutation = useMutation({
        mutationKey:["createManager"],
        mutationFn:createManager,
        onError:(err:AxiosError<ErrorResponse>)=>{
            console.log("mutation Error",err)
            const errorMeassge = err.response?.data.message || "Something went wrong.Try it again!"
            setErrMsg(errorMeassge)
            // toast
            toast.error(errorMeassge,{position:'top-right'})
        },
        onSuccess:(response)=>{
            console.log("resp ",response);
            toast.success(response.message,{position:'top-right'})
            reset()
        }
    })
    const {register,reset,handleSubmit,formState:{errors}} = useForm<FormFields>({
        resolver:zodResolver(schema)
    })
    const onSubmit = (data:FormFields)=>{
        console.log("data",data);
        mutation.mutate(data)
    }
  return (
    
    <div className="container grid w-full min-h-screen grid-cols-1 place-items-center bg-dashboard/50">
            <div className="w-full max-w-lg p-8 rounded-lg shadow-lg bg-card/75">
            
            <h1 className="self-center mt-1 text-2xl font-bold text-center text-copy-primary">Create Manager</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col self-center w-full p-4 mt-2 rounded shadow-md ">
                <span className='self-center font-medium text-left text-copy-primary/60'>Enter information to create an account</span><br/>
                {mutation.isError && (
                  
                  <span className="self-center mb-1 text-sm text-red-500">{errMsg}</span>
                )}
                <label className="mt-1">
                    <span className="block text:md after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold  mt-1 text-copy-secondary ">Name</span>
                    <input 
                    className="w-full p-1 mb-1 font-medium text-black border rounded peer focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 invalid:text-red-500 invalid:focus:border-red-500 invalid:focus:ring-red-500 placeholder:text-gray-400"
                    {...register("name",{
                        required:"name is required",
                        minLength:4
                        })} type="text" placeholder="Enter your name" />
                </label>
                {errors.name && <span className="text-sm font-medium text-red-600"> {errors.name.message}</span>}
                <label className="mt-1">
                    <span className="block text:md after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold  mt-1 text-copy-secondary ">Email</span>
                    <input 
                    className="w-full p-1 mb-1 font-medium text-black border rounded peer focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 invalid:text-red-500 invalid:focus:border-red-500 invalid:focus:ring-red-500 placeholder:text-gray-400"
                    {...register("email",{
                        required:"email is required",
                        validate:(value)=> value.includes("@")
                        })} type="email" placeholder="Enter your email" />
                </label>
                {errors.email && <span className="text-sm font-medium text-red-600"> {errors.email.message}</span>}
                
                <label className="mt-1">
                    <span className="block text:md after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold  mt-1 text-copy-secondary ">Password</span>
                    <input 
                    className="w-full p-1 mb-1 font-medium text-black border rounded peer focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 invalid:text-red-500 invalid:focus:border-red-500 invalid:focus:ring-red-500 placeholder:text-gray-400 "
                    {...register("password",
                        {
                            required:"Password is required",
                            minLength:6
    
                        })} type="password" placeholder="Enter the password"/>
                </label>
                {errors.password && <span className="text-sm font-medium text-red-600">{errors.password.message}</span>}
                <label className="mt-1">
                    <span className="block text:md after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold  mt-1 text-copy-secondary ">Confirm Password</span>
                    <input 
                    className="w-full p-1 mb-1 font-medium text-black border rounded peer focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 invalid:text-red-500 invalid:focus:border-red-500 invalid:focus:ring-red-500 placeholder:text-gray-400 "
                    {...register("confirmPassword",
                        {
                            required:"confirmPassword is required",
                            minLength:6
    
                        })} type="password" placeholder="Enter the confirm password"/>
                </label>
                {errors.confirmPassword && <span className="text-sm font-medium text-red-600">{errors.confirmPassword.message}</span>}
                
                <button 
                className={` bg-cta hover:bg-cta-active transition-colors text-cta-text font-semibold w-full py-2 rounded-md mt-6 mb-4 flex items-center justify-center gap-2 ${mutation.isPending?'cursor-not-allowed opacity-45':''}`}
                type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && <span>
                    <LoaderCircle strokeWidth={2} className="text-bg-cta animate-spin" /></span>}
                  Submit
                </button>
                
            </form>
    
            
            <ToastContainer/>
        </div>
        </div>
  )
}

export default CreateManager