import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from 'zod'
import { login } from "../../http/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { addUserDetails } from "../../features/auth/authSlice";
import { LoaderCircle } from "lucide-react";


type FormFields = {
    email:string,
    password:string;
}

const schema = z.object({
    email:z.string().email(),
    password:z.string().trim().min(6,"Password must be 6 character is long")
})

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  // const data= useSelector((state:RootState)=>state.auth)
  // mutation for data send for login
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
  
      if (response.data.success) {
        const { accessToken, refreshToken, userDetails } = response.data;
        const { id, email, name } = userDetails;
        console.log("userDetails from login ",userDetails);
        
        dispatch(addUserDetails({isLogin:true,accessToken, refreshToken, userId:id,useremail:email, userName:name}))
        
        // Save user data in sessionStorage
        const user = { id, name, email,accessToken ,refreshToken};
        sessionStorage.setItem('user', JSON.stringify(user));
  
        // Retrieve user data from sessionStorage
        const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
        console.log("Retrieve user data from sessionStorage:",userData);
        // console.log("Retrieve user data from sessionStorage:",userData.isLogin);
        console.log("Retrieve user data from sessionStorage:",userData.accessToken);
        navigate('/dashboard/product/allProducts')
        
      }
      // TODO: Navigate to products list page
    },
  });
  
    const {register,
        handleSubmit,
        formState:{errors}} = useForm<FormFields>({
            resolver: zodResolver(schema)
        })
    const onSubmit:SubmitHandler<FormFields>=(data)=>{
       
        mutation.mutate(data)
        
    }
    
  return (
    <div className="w-full max-w-lg p-8 rounded-lg shadow-lg bg-card/75">
        
        <h1 className="self-center mt-1 text-2xl font-bold text-center text-copy-primary">Login</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col self-center w-full p-6 rounded shadow-xl">
              <span className='self-center mb-2 font-medium text-left text-copy-primary/60'>Enter your email below to login to your       account.</span> 
              {mutation.isError && (
                  <span className="self-center mb-1 text-sm text-red-500">{'Something went wrong.Try it again!'}</span>
              )}
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
            
            <button 
            className={` bg-cta hover:bg-cta-active transition-colors text-cta-text font-semibold w-full py-2 rounded-md mt-6 mb-4 flex items-center justify-center gap-2 ${mutation.isPending?'cursor-not-allowed opacity-45':''}`}
            type="submit" disabled={mutation.isPending} >
              {mutation.isPending && <span>
                <LoaderCircle strokeWidth={2} className="text-bg-cta animate-spin" /></span>}
              Submit
            </button>
            <div className=" text-copy-primary">
          <p className="text-sm ">
            By continuing, I agree to the Terms of Use & Privacy Policy
          </p>

          <p className="">
            Don&apos;t have an Account?{" "}
            <span
              className="font-semibold cursor-pointer"
              onClick={() => navigate('/auth/register')}
            >
              Create Account
            </span>
          </p>
          </div>
        </form>

        
        
    </div>
    
  )
}

export default LoginForm