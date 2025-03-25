import { useMutation } from "@tanstack/react-query"
import { changePassword } from "../http/api"
import { useForm } from "react-hook-form"
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import { LoaderCircle } from "lucide-react";
import { AxiosError } from "axios";
import { useState } from "react";

interface FormFields {
  oldPassword:string,
  password:string,
  confirmPassword:string
}
interface ErrorResponse{
  message:string
}

const schema = z.object({
  oldPassword: z.string().trim().min(6, { message: "Must be 6 or more characters long" }),
  password: z.string().trim().min(6, { message: "Must be 6 or more characters long" }),
  confirmPassword: z.string().trim().min(6, { message: "Must be 6 or more characters long" })
}).refine((data)=>data.password === data.confirmPassword,{
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const ChangePassword = () => {
  const [errMsg,setErrMsg] = useState("")
  const mutation = useMutation({
    mutationKey:["updatePassword"],
    mutationFn:changePassword,
    onError:(err:AxiosError<ErrorResponse>)=>{
      console.log("error on change password",err);
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
  const {register,formState:{errors},handleSubmit,reset } = useForm<FormFields>({
    resolver:zodResolver(schema)
  })
  const onSubmit =(data:FormFields)=>{
    console.log("data",data);
    mutation.mutate(
      data
    )
  }
  return (
    
    <div className="container flex ">
      <div className="self-center w-full max-w-lg p-8 mx-auto rounded-lg shadow-lg bg-card/75">
        
        <h1 className="mt-1 text-2xl font-bold text-center text-copy-primary">Change Password</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col self-center w-full p-6 rounded shadow-xl">
              
              {mutation.isError && (
                  <span className="self-center mb-1 text-sm text-red-500">{errMsg}</span>
              )}
            <label className="mt-1">
                <span className="block text:md after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold  mt-1 text-copy-secondary ">Old Password</span>
                <input 
                className="w-full p-1 mb-1 font-medium text-black border rounded peer focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 invalid:text-red-500 invalid:focus:border-red-500 invalid:focus:ring-red-500 placeholder:text-gray-400"
                {...register("oldPassword")} type="password" placeholder="Enter your oldPassword" />
            </label>
            {errors.oldPassword && <span className="text-sm font-medium text-red-600"> {errors.oldPassword.message}</span>}
            
            <label className="mt-1">
                <span className="block text:md after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold  mt-1 text-copy-secondary ">New Password</span>
                <input 
                className="w-full p-1 mb-1 font-medium text-black border rounded peer focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 invalid:text-red-500 invalid:focus:border-red-500 invalid:focus:ring-red-500 placeholder:text-gray-400 "
                {...register("password")} type="password" placeholder="Enter the new password"/>
            </label>
            {errors.password && <span className="text-sm font-medium text-red-600">{errors.password.message}</span>}
            <label className="mt-1">
                <span className="block text:md after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold  mt-1 text-copy-secondary ">Confirm Password</span>
                <input 
                className="w-full p-1 mb-1 font-medium text-black border rounded peer focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 invalid:text-red-500 invalid:focus:border-red-500 invalid:focus:ring-red-500 placeholder:text-gray-400 "
                {...register("confirmPassword")} type="password" placeholder="Enter the new password"/>
            </label>
            {errors.confirmPassword && <span className="text-sm font-medium text-red-600">{errors.confirmPassword.message}</span>}
            
            <button 
            className={` bg-cta hover:bg-cta-active transition-colors text-cta-text font-semibold w-full py-2 rounded-md mt-6 mb-4 flex items-center justify-center gap-2 ${mutation.isPending?'cursor-not-allowed opacity-45':''}`}
            type="submit" disabled={mutation.isPending} >
              {mutation.isPending && <span>
                <LoaderCircle strokeWidth={2} className="text-bg-cta animate-spin" /></span>}
              Update
            </button>
            
        </form>

        
        <ToastContainer/>
    </div>
    </div>
  )
}

export default ChangePassword