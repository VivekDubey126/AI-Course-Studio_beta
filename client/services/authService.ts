const API = "http://localhost:5000/api/auth";

export const registerUser = async (name:string,email:string,password:string) => {

  const res = await fetch(`${API}/register`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({name,email,password})
  });

  const data = await res.json();

  if(!res.ok) throw new Error(data.message);

  return data;
};

export const loginUser = async (email:string,password:string) => {

  const res = await fetch(`${API}/login`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({email,password})
  });

  const data = await res.json();

  if(!res.ok) throw new Error(data.message);

  return data;
};


export const forgotPassword = async (email:string) => {

  const res = await fetch(`${API}/forgot-password`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({email})
  });

  const data = await res.json();

  if(!res.ok) throw new Error(data.message);

  return data;
};


export const resetPassword = async (token:string,password:string) => {

  const res = await fetch(`${API}/reset-password/${token}`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({password})
  });

  const data = await res.json();

  if(!res.ok) throw new Error(data.message);

  return data;
};
