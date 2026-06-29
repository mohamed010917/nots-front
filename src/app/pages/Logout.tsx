import React from 'react'
import { useDispatch } from 'react-redux';
import { clearUser } from '../../slices/UserSlice';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const dispatch = useDispatch() ;
    const navigate = useNavigate() ;
    const handleLogout = () => {
        dispatch(clearUser());
        cookieStore.delete("token") ;
        navigate("/login") ;
    };
  return (
    <div>
      <button onClick={()=> handleLogout()} className='bg-red-500 text-white px-4 py-1 cursor-pointer rounded-md hover:bg-red-600 transition-colors'>Logout</button>
    </div>
  )
}

export default Logout
