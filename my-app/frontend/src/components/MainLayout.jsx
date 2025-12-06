import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className='flex'>
      {/* Left Sidebar - Fixed width */}
      <LeftSidebar />
      
      {/* Main Content Area - Takes remaining space */}
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout