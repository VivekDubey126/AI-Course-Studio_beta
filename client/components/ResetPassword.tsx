import React,{useState} from "react";
import { useParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword(){

 const {token}=useParams();

 const [password,setPassword]=useState("");
 const [msg,setMsg]=useState("");

 const handleSubmit=async(e:any)=>{
  e.preventDefault();

  try{

   const data=await resetPassword(token!,password);

   setMsg(data.message);

  }catch(err:any){

   setMsg(err.message);

  }

 };

 return(

 <div className="flex items-center justify-center min-h-screen">

 <form onSubmit={handleSubmit} className="bg-black p-8 rounded-xl">

 <h2 className="text-xl mb-4">Reset Password</h2>

 <input
 type="password"
 placeholder="New password"
 value={password}
 onChange={(e)=>setPassword(e.target.value)}
 className="p-2 mb-4 w-full"
 />

 <button className="bg-indigo-600 p-2 w-full">
 Reset Password
 </button>

 <p className="mt-4">{msg}</p>

 </form>

 </div>

 );
}
