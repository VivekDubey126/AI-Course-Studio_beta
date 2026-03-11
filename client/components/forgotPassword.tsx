import React,{useState} from "react";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword(){

 const [email,setEmail]=useState("");
 const [msg,setMsg]=useState("");

 const handleSubmit=async(e:any)=>{
  e.preventDefault();

  try{
   const data=await forgotPassword(email);
   setMsg(data.message);
  }catch(err:any){
   setMsg(err.message);
  }
 };

 return(

  <div className="flex items-center justify-center min-h-screen">

   <form onSubmit={handleSubmit} className="bg-black p-8 rounded-xl">

   <h2 className="text-xl mb-4">Forgot Password</h2>

   <input
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    className="p-2 mb-4 w-full"
   />

   <button className="bg-indigo-600 p-2 w-full">
    Send Reset Link
   </button>

   <p className="mt-4">{msg}</p>

   </form>

  </div>
 );
}