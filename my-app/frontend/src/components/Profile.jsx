// import React, { useState } from 'react'
// import { Grid3X3, Bookmark } from 'lucide-react'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import useGetUserProfile from '@/hooks/useGetUserProfile';
// import { Link, useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { Button } from './ui/button';
// import { Badge } from './ui/badge';
// import { AtSign, Heart, MessageCircle } from 'lucide-react';

// const Profile = () => {
//   const params = useParams();
//   const userId = params.id;
//   useGetUserProfile(userId);
//   const [activeTab, setActiveTab] = useState('posts');

//   const { userProfile, user } = useSelector(store => store.auth);

//   const isLoggedInUserProfile = user?._id === userProfile?._id;
//   const isFollowing = false;

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   }

//   const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

//   return (
//     <div className='flex max-w-5xl justify-center mx-auto pl-10'>
//       <div className='flex flex-col gap-20 p-8'>
//         <div className='grid grid-cols-2'>
//           <section className='flex items-center justify-center'>
//             <Avatar className='h-40 w-40'>
//               <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
//               <AvatarFallback>CN</AvatarFallback>
//             </Avatar>
//           </section>
//           <section>
//             <div className='flex flex-col gap-5'>

//               <div className='flex items-center gap-4'>
//                 <p><span className='font-semibold'>{userProfile?.posts.length} </span>Bài viết</p>
//                 <p><span className='font-semibold'>{userProfile?.followers.length} </span>Người theo dõi</p>
//                 <p><span className='font-semibold'>{userProfile?.following.length} </span>Đang theo dõi</p>
//               </div>
//               <div className='flex flex-col gap-1'>
//                 <span className="text-xl font-bold tracking-tight">
//                   {userProfile?.bio || 'No Bio Yet'}
//                 </span>

//                 <Badge className='w-fit' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
//                 <span>Tiểu sử</span>
//               </div>

//             </div>
//             <div className="mt-6 w-full">
//               {isLoggedInUserProfile ? (
//                 /* ===== PROFILE CỦA MÌNH ===== */
//                 <Link to="/account/edit" className="block w-full">
//                   <Button
//                     variant="secondary"
//                     className="
//           w-full h-11
//           rounded-lg
//           text-sm font-semibold
//           bg-gray-100 hover:bg-gray-200
//           transition-colors
//         "
//                   >
//                     Chỉnh sửa trang cá nhân
//                   </Button>
//                 </Link>
//               ) : (
//                 /* ===== PROFILE NGƯỜI KHÁC ===== */
//                 <div className="grid grid-cols-2 gap-3">
//                   {isFollowing ? (
//                     <>
//                       <Button
//                         variant="secondary"
//                         className="
//               h-11 rounded-lg
//               font-semibold
//               bg-gray-100 hover:bg-gray-200
//               transition-colors
//             "
//                       >
//                         Unfollow
//                       </Button>

//                       <Button
//                         variant="secondary"
//                         className="
//               h-11 rounded-lg
//               font-semibold
//               bg-gray-100 hover:bg-gray-200
//               transition-colors
//             "
//                       >
//                         Message
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       <Button
//                         className="
//               h-11 rounded-lg
//               bg-[#0095F6] hover:bg-[#1877F2]
//               text-white font-semibold
//               transition-colors
//             "
//                       >
//                         Follow
//                       </Button>

//                       <Button
//                         variant="secondary"
//                         className="
//               h-11 rounded-lg
//               font-semibold
//               bg-gray-100 hover:bg-gray-200
//               transition-colors
//             "
//                       >
//                         Message
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>

//           </section>





//         </div>
//         <div className='border-t border-t-gray-200'>
//           <div className="grid grid-cols-2 border-t border-gray-200">
//             {/* POSTS */}
//             <button
//               onClick={() => handleTabChange('posts')}
//               className={`flex justify-center items-center py-4 border-t-2 ${activeTab === 'posts'
//                 ? 'border-black text-black'
//                 : 'border-transparent text-gray-400'
//                 }`}
//             >
//               <Grid3X3 size={22} />
//             </button>

//             {/* SAVED */}
//             <button
//               onClick={() => handleTabChange('saved')}
//               className={`flex justify-center items-center py-4 border-t-2 ${activeTab === 'saved'
//                 ? 'border-black text-black'
//                 : 'border-transparent text-gray-400'
//                 }`}
//             >
//               <Bookmark size={22} />
//             </button>
//           </div>

//           <div className='grid grid-cols-3 gap-1'>
//             {
//               displayedPost?.map((post) => {
//                 return (
//                   <div key={post?._id} className='relative group cursor-pointer'>
//                     <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
//                     <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
//                       <div className='flex items-center text-white space-x-4'>
//                         <button className='flex items-center gap-2 hover:text-gray-300'>
//                           <Heart />
//                           <span>{post?.likes.length}</span>
//                         </button>
//                         <button className='flex items-center gap-2 hover:text-gray-300'>
//                           <MessageCircle />
//                           <span>{post?.comments.length}</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })
//             }
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile

import React, { useState } from 'react'
import { Grid3X3, Bookmark } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Added useDispatch
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner'; // Assuming you use sonner or similar for toasts
import { setAuthUser, setUserProfile } from '@/redux/authSlice'; // Import your redux actions

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile, user } = useSelector(store => store.auth);
  const dispatch = useDispatch(); // Initialize dispatch

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  
  // 1. DYNAMICALLY CHECK IF FOLLOWING
  const isFollowing = user?.following?.includes(userProfile?._id);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  // 2. HANDLE FOLLOW/UNFOLLOW LOGIC
  const handleFollowOrUnfollow = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`, {}, {
        withCredentials: true
      });

      if (res.data.success) {
        // Optimistic UI Update:
        // Update the logged-in user's following list
        const updatedFollowing = isFollowing
          ? user.following.filter(id => id !== userProfile?._id) // Unfollow: Remove ID
          : [...user.following, userProfile?._id]; // Follow: Add ID

        // Update the target profile's followers list (to update the count instantly)
        const updatedFollowers = isFollowing
          ? userProfile.followers.filter(id => id !== user._id) // Remove my ID
          : [...userProfile.followers, user._id]; // Add my ID

        // Dispatch updates to Redux store
        dispatch(setAuthUser({ ...user, following: updatedFollowing }));
        dispatch(setUserProfile({ ...userProfile, followers: updatedFollowers }));
        
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  }

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-40 w-40'>
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>

              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.posts.length} </span>Bài viết</p>
                <p><span className='font-semibold'>{userProfile?.followers.length} </span>Người theo dõi</p>
                <p><span className='font-semibold'>{userProfile?.following.length} </span>Đang theo dõi</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className="text-xl font-bold tracking-tight">
                  {userProfile?.bio || 'No Bio Yet'}
                </span>

                <Badge className='w-fit' variant='secondary'><AtSign /> <span className='pl-1'>{userProfile?.username}</span> </Badge>
                <span>Tiểu sử</span>
              </div>

            </div>
            <div className="mt-6 w-full">
              {isLoggedInUserProfile ? (
                /* ===== PROFILE CỦA MÌNH ===== */
                <Link to="/account/edit" className="block w-full">
                  <Button
                    variant="secondary"
                    className="w-full h-11 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Chỉnh sửa trang cá nhân
                  </Button>
                </Link>
              ) : (
                /* ===== PROFILE NGƯỜI KHÁC ===== */
                <div className="grid grid-cols-2 gap-3">
                  {isFollowing ? (
                    <>
                      {/* UNFOLLOW BUTTON */}
                      <Button
                        variant="secondary"
                        onClick={handleFollowOrUnfollow} 
                        className="h-11 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        Unfollow
                      </Button>

                      <Button
                        variant="secondary"
                        className="h-11 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        Message
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* FOLLOW BUTTON */}
                      <Button
                        onClick={handleFollowOrUnfollow}
                        className="h-11 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold transition-colors"
                      >
                        Follow
                      </Button>

                      <Button
                        variant="secondary"
                        className="h-11 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        Message
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

          </section>
        </div>
        
        {/* ... Rest of your code (Posts/Saved section) ... */}
        <div className='border-t border-t-gray-200'>
          <div className="grid grid-cols-2 border-t border-gray-200">
            {/* POSTS */}
            <button
              onClick={() => handleTabChange('posts')}
              className={`flex justify-center items-center py-4 border-t-2 ${activeTab === 'posts'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400'
                }`}
            >
              <Grid3X3 size={22} />
            </button>

            {/* SAVED */}
            <button
              onClick={() => handleTabChange('saved')}
              className={`flex justify-center items-center py-4 border-t-2 ${activeTab === 'saved'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400'
                }`}
            >
              <Bookmark size={22} />
            </button>
          </div>

          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile