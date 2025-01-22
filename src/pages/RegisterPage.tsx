import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import z from 'zod'


type FormFields={
  name:string,
  email:string,
  password:string,
  confirmPassword:string
}

const formSchema= z.object({
  name:z.string().trim().min(4,"Minimum four charcter required"),
  email:z.string().email(),
  password:z.string().min(6,"Password Must be 6 or more characters long"),
  confirmPassword:z.string()
}).refine((data)=>data.password === data.confirmPassword,{
  message:"Passwords don't match",
  path:["confirmPassword"]
})


const RegisterPage = () => {
  const navigate = useNavigate()
  const {register,handleSubmit,formState:{errors}} = useForm<FormFields>({
    resolver:zodResolver(formSchema)
  })
  const onSubmit:SubmitHandler<FormFields>=(data)=>{
    console.log(data)
  }
  return (
    <div className="container grid w-full min-h-screen grid-cols-1 place-items-center bg-dashboard/50">
        <div className="w-full max-w-lg p-8 rounded-lg shadow-lg bg-card/75">
        
        <h1 className="self-center mt-1 text-2xl font-bold text-center text-copy-primary">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col self-center w-full p-4 mt-2 rounded shadow-md ">
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
            className={` bg-cta hover:bg-cta-active transition-colors text-cta-text font-semibold w-full py-2 rounded-md mt-6 mb-4`}
            type="submit">Submit</button>
            <div className=" text-copy-primary">
            <p className="text-sm ">
            By continuing, I agree to the Terms of Use & Privacy Policy
          </p>

          <p className="font-normal ">
            Already have an Account?{" "}
            <span
              className="font-semibold cursor-pointer"
              onClick={() => navigate('/dashboard/auth/login')}
            >
              Try Login
            </span>
          </p>
          </div>
        </form>

        
        
    </div>
    </div>
  )
}

export default RegisterPage