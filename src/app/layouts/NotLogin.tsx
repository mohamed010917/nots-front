import { useEffect } from "react";
import {  Outlet, useNavigate } from "react-router-dom";

export default  function NotLogin() {
    const navigate = useNavigate();
    const checkToken = async ()=> {
      const token = await cookieStore.get("token");
      if(token?.value){
          navigate("/");
      }
    }
    useEffect(()=>{
      checkToken();
    },[]) ;

  return (
    <>
      <Outlet />
    </>
 
  );
}