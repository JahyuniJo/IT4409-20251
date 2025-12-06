import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
// import useGetAllPost from '@/hooks/useGetAllPost'
// import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home = () => {
    // useGetAllPost(); // Uncomment when you have backend
    // useGetSuggestedUsers(); // Uncomment when you have backend
    
    return (
        <div className='flex'>
            <div className='flex-grow'>
                <Feed />
                <Outlet />
            </div>
            {/* <RightSidebar /> */} {/* Uncomment this later */}
        </div>
    )
}

export default Home