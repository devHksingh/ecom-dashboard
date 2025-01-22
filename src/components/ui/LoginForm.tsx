import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import z from 'zod'


type FormFields = {
    email:string,
    password:string;
}

const schema = z.object({
    email:z.string().email(),
    password:z.string().trim().min(6,"Password must be 6 character is long")
})

const LoginForm = () => {
    const {register,
        handleSubmit,
        formState:{errors}} = useForm<FormFields>({
            resolver: zodResolver(schema)
        })
    const onSubmit:SubmitHandler<FormFields>=(data)=>{
        console.log(data);
        
        console.log(data.email)
        console.log(data.password)
    }
  return (
    <div className="flex flex-col  justify-center w-full gap-4  rounded-lg shadow-md h-[55%] bg-dashboard">
        <div className="flex flex-col w-full h-full gap-4 p-4 mx-auto">
        <h1 className="self-center mt-4 text-2xl font-bold">LoginForm</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col self-center w-full p-4 mt-12 rounded shadow-md bg-card/90">
            <label >
                <span className="block text:md after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold  mt-1 text-copy-secondary">Email</span>
                <input 
                className="w-full p-1 mb-1 font-medium text-black border rounded peer focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 invalid:text-red-500 invalid:focus:border-red-500 invalid:focus:ring-red-500 placeholder:text-gray-400"
                {...register("email",{
                    required:"email is required",
                    validate:(value)=> value.includes("@")
                    })} type="email" placeholder="Enter your email" />
            </label>
            {errors.email && <span className="text-sm font-medium text-red-600"> {errors.email.message}</span>}
            <label>
                <span className="block text:md after:content-['*'] after:ml-0.5 after:text-red-500 font-semibold  mt-1 text-copy-secondary">Password</span>
                <input 
                className="w-full p-1 mb-1 font-medium text-black border rounded peer focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 invalid:text-red-500 invalid:focus:border-red-500 invalid:focus:ring-red-500 placeholder:text-gray-400 "
                {...register("password",
                    {
                        required:"Password is required",
                        minLength:6

                    })} type="password" placeholder="Enter the password"/>
            </label>
            {errors.password && <span className="text-sm font-medium text-red-600">{errors.password.message}</span>}
            <button 
            className={` bg-cta hover:bg-cta-active transition-colors text-cta-text font-semibold w-full py-2 rounded-md mt-3 mb-4`}
            type="submit">Submit</button>
        </form>
        </div>
    </div>
  )
}

export default LoginForm