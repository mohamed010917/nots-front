// create 404 page with a button to go back to the dashboard
import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    const navigate = useNavigate() ;
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-background'>
        <h1 className='text-6xl font-bold text-primary mb-4'>404</h1>
        <p className='text-xl text-muted-foreground mb-8'>Oops! The page you're looking for doesn't exist.</p>
        <button onClick={()=> navigate("/dashboard")} className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors'>Go back to Dashboard</button>
    </div>
  )
}

export default NotFound