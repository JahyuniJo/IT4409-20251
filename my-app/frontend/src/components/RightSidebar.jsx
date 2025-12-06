import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

const SUGGESTED_USERS = [
  { id: 1, username: 'alex_photos', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/40?img=1' },
  { id: 2, username: 'travel_diary', name: 'Sarah Lee', avatar: 'https://i.pravatar.cc/40?img=2' },
  { id: 3, username: 'food_lover', name: 'Mike Chen', avatar: 'https://i.pravatar.cc/40?img=3' },
  { id: 4, username: 'fitness_pro', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/40?img=4' },
  { id: 5, username: 'art_studio', name: 'David Brown', avatar: 'https://i.pravatar.cc/40?img=6' },
]

const RightSidebar = () => {
  const currentUser = {
    username: 'demo_user',
    name: 'Demo User',
    avatar: 'https://i.pravatar.cc/40'
  }

  return (
    <div className='w-[350px] my-10 pr-8 hidden lg:block'>
      {/* Current User Profile */}
      <div className='flex items-center gap-3 mb-8'>
        <Avatar className='w-12 h-12'>
          <AvatarImage src={currentUser.avatar} />
          <AvatarFallback>{currentUser.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <p className='font-semibold text-sm'>{currentUser.username}</p>
          <p className='text-gray-500 text-sm'>{currentUser.name}</p>
        </div>
        <Button variant="ghost" className='text-blue-500 font-semibold text-sm hover:text-blue-600'>
          Switch
        </Button>
      </div>

      {/* Suggestions Section */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <p className='font-semibold text-gray-500 text-sm'>Suggestions For You</p>
          <Button variant="ghost" className='text-xs font-semibold hover:text-gray-600 p-0 h-auto'>
            See All
          </Button>
        </div>

        {/* Suggested Users List */}
        <div className='space-y-4'>
          {SUGGESTED_USERS.map((user) => (
            <div key={user.id} className='flex items-center gap-3'>
              <Avatar className='w-10 h-10 cursor-pointer'>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className='flex-1'>
                <p className='font-semibold text-sm cursor-pointer hover:text-gray-600'>
                  {user.username}
                </p>
                <p className='text-gray-500 text-xs'>{user.name}</p>
              </div>
              <Button 
                variant="ghost" 
                className='text-blue-500 font-semibold text-xs hover:text-blue-600 p-0 h-auto'
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className='mt-8 text-xs text-gray-400 space-y-1'>
        <div className='flex flex-wrap gap-x-2 gap-y-1'>
          <a href='#' className='hover:underline'>About</a>
          <span>·</span>
          <a href='#' className='hover:underline'>Help</a>
          <span>·</span>
          <a href='#' className='hover:underline'>Press</a>
          <span>·</span>
          <a href='#' className='hover:underline'>API</a>
          <span>·</span>
          <a href='#' className='hover:underline'>Jobs</a>
          <span>·</span>
          <a href='#' className='hover:underline'>Privacy</a>
          <span>·</span>
          <a href='#' className='hover:underline'>Terms</a>
        </div>
        <p className='text-gray-400'>© 2024 INSTAGRAM CLONE</p>
      </div>
    </div>
  )
}

export default RightSidebar