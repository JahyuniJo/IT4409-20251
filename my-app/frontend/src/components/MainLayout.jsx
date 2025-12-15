import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className='flex'>
      <LeftSidebar />
      
      {/* FIX: Add margin-left (ml) to match your sidebar width.
         If LeftSidebar is w-[16%], add ml-[16%].
         If LeftSidebar is w-64 (256px), add ml-64.
      */}
      <div className='flex-1 ml-[16%]'> 
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout