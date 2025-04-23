import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'


const Mainlayout = () => {
  const location = useLocation();

  const navigate = useNavigate();
  useEffect(()=>{
    if (!localStorage.getItem('token')){
      navigate('/auth')
    }
  },[location.pathname])
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Outlet/>
      </div>
    </div>
  )
}

export default Mainlayout