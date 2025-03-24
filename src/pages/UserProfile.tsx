import { useQuery } from "@tanstack/react-query"
import { getuser } from "../http/api"
// import { useState } from "react"
import { Link } from "react-router-dom"
import { AxiosError } from "axios"

interface ErrorResponse {
  message: string;
}

const UserProfile = () => {
  // const [userData,setUserData]= useState({})
  const {data,isLoading,isError,error} = useQuery({
    queryKey:["getUserInfo"],
    queryFn:getuser
  })
  if(data){
    console.log("data",data);
    console.log("data.user",data.user);
    console.log("data.user",data.user.name);
    // setUserData(data.user)
  }
  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (isError) {
    const axiosError = error as AxiosError<ErrorResponse>
    return (
      <div className="max-w-4xl p-4 mx-auto md:p-6">
        <div className="p-4 border-l-4 border-red-500 rounded-md bg-red-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading profile</h3>
              <p className="mt-1 text-sm text-red-700">
                {axiosError.response?.data?.message || "Unable to load user profile. Please try again later."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container px-4 py-6 mx-auto text-copy-primary">
        <div className="p-6 mx-auto rounded-lg shadow-md max-w-8xl">
            <h1 className="mb-6 text-2xl font-bold">My Profile</h1>
            <div className="p-6 mb-8 border rounded-lg max-w-lg">
              <div className="flex flex-col gap-2">
              <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                      <p className="text-lg">Name: {data.user.name}</p>
                      <p className="text-lg">Email: {data.user.email}</p>
                      <p className="text-lg">Role: {data.user.role}</p>
                      <p className="text-lg">CreatedAt: {formatDate(data.user.createdAt)}</p>
                      <Link to={'/dashboard/userProfile/changePassword'} className="self-start px-1 py-2 text-red-600 bg-red-100 rounded-md">Reset Password</Link>
                
              </div>
            </div>
            <div className="flex items-center w-full h-full text-gray-600 bg-gray-300">
                    
                    <div>
                      
                    </div>
            </div>
        </div>
    </div>
  )
}

export default UserProfile