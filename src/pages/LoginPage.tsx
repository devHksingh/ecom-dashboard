import LoginForm from "../components/ui/LoginForm"
import LoginImg from '../assets/Performance Evaluation 1 (1).svg'

const LoginPage = () => {
  return (
    <section className="container grid w-full min-h-screen grid-cols-1 gap-2 md:grid-cols-2 place-items-center">
        {/* <div className="h-full">
          
        </div> */}
          <LoginForm/>
          
        
      
      <div className="hidden w-full rounded-md md:block bg-[#E4E4D3]/5">
        <img src={LoginImg} 
        alt="Login dummy img" 
        
        width="50%"
        loading="lazy"
        className="object-cover w-3/4 mx-auto rounded-md "
        />
      </div>
    </section>
  )
}

export default LoginPage