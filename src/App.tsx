
import './App.css'
import { BrowserRouter, Route , Routes } from 'react-router-dom'
import LandingPage from './app/pages/LandingPage'
import LoginPage from './app/pages/LoginPage'
import RejusterPage from './app/pages/RejusterPage'
import NotLogin from './app/layouts/NotLogin'
import { useDispatch, useSelector } from 'react-redux'
import DashboardPage from './app/pages/DashbordPage'
import AppLayout from './app/layouts/AppLayout'
import { useEffect, useState } from 'react'
import { fetchUserData, getToken } from './slices/UserSlice'
import NotsPage from './app/pages/NotsPage'
import NotFound from './app/pages/NotFound'
import NoteEditorPage from './app/pages/NoteEditorPage'
import ShowNots from './app/pages/ShowNots'
import Profile from './app/pages/Profile'
import TasksPage from './app/pages/TaskPage'

function App() {

  const dispatch = useDispatch<any>() ;
  const user = useSelector((state : any) => state.user.user) ;
  const token = useSelector((state : any) => state.user.token) ;

  useEffect(()=>{
    if(!user){
      dispatch(getToken()) ;
    }
     return () => {
     }
  },[dispatch]);
  useEffect(()=>{
    if(token && !user){
      dispatch(fetchUserData(token)) ;
    }
     return () => {
     }
  },[dispatch, token]);

  return (
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/" element={<AppLayout  />} > 
                <Route path='dashboard' element={<DashboardPage />} />
                <Route path="notes" element={<NotsPage />} />
                <Route path="nots/add" element={<NoteEditorPage />} />
                <Route path="notes/edit/:id" element={<NoteEditorPage />} />
                <Route path="notes/:id" element={<ShowNots />} />
                <Route path="profile" element={<Profile />} />
                <Route path="tasks" element={<TasksPage />} />
            </Route>
            <Route path='/' element={<NotLogin />} >
              <Route path="login" element={<LoginPage  />} />
              <Route path="register" element={<RejusterPage  />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
    </BrowserRouter>
  )
}

export default App
