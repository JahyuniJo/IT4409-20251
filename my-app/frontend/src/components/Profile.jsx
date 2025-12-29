// import React, { useState } from 'react'
// import { Grid3X3, Bookmark } from 'lucide-react'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import useGetUserProfile from '@/hooks/useGetUserProfile';
// import { Link, useParams } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux'; // Added useDispatch
// import { Button } from './ui/button';
// import { Badge } from './ui/badge';
// import { AtSign, Heart, MessageCircle } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'sonner'; // Assuming you use sonner or similar for toasts
// import { setAuthUser, setUserProfile } from '@/redux/authSlice'; // Import your redux actions

// const Profile = () => {
//   const params = useParams();
//   const userId = params.id;
//   useGetUserProfile(userId);
//   const [activeTab, setActiveTab] = useState('posts');

//   const { userProfile, user } = useSelector(store => store.auth);
//   const dispatch = useDispatch(); // Initialize dispatch

//   const isLoggedInUserProfile = user?._id === userProfile?._id;
  
//   // 1. DYNAMICALLY CHECK IF FOLLOWING
//   const isFollowing = user?.following?.includes(userProfile?._id);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   }

//   const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

//   // 2. HANDLE FOLLOW/UNFOLLOW LOGIC
//   const handleFollowOrUnfollow = async () => {
//     try {
//       const res = await axios.post(`http://localhost:8000/api/v1/user/followorunfollow/${userProfile?._id}`, {}, {
//         withCredentials: true
//       });

//       if (res.data.success) {
//         // Optimistic UI Update:
//         // Update the logged-in user's following list
//         const updatedFollowing = isFollowing
//           ? user.following.filter(id => id !== userProfile?._id) // Unfollow: Remove ID
//           : [...user.following, userProfile?._id]; // Follow: Add ID

//         // Update the target profile's followers list (to update the count instantly)
//         const updatedFollowers = isFollowing
//           ? userProfile.followers.filter(id => id !== user._id) // Remove my ID
//           : [...userProfile.followers, user._id]; // Add my ID

//         // Dispatch updates to Redux store
//         dispatch(setAuthUser({ ...user, following: updatedFollowing }));
//         dispatch(setUserProfile({ ...userProfile, followers: updatedFollowers }));
        
//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response?.data?.message || 'Something went wrong');
//     }
//   }

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
//                     className="w-full h-11 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
//                   >
//                     Chỉnh sửa trang cá nhân
//                   </Button>
//                 </Link>
//               ) : (
//                 /* ===== PROFILE NGƯỜI KHÁC ===== */
//                 <div className="grid grid-cols-2 gap-3">
//                   {isFollowing ? (
//                     <>
//                       {/* UNFOLLOW BUTTON */}
//                       <Button
//                         variant="secondary"
//                         onClick={handleFollowOrUnfollow} 
//                         className="h-11 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
//                       >
//                         Unfollow
//                       </Button>

//                       <Button
//                         variant="secondary"
//                         className="h-11 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
//                       >
//                         Message
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       {/* FOLLOW BUTTON */}
//                       <Button
//                         onClick={handleFollowOrUnfollow}
//                         className="h-11 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold transition-colors"
//                       >
//                         Follow
//                       </Button>

//                       <Button
//                         variant="secondary"
//                         className="h-11 rounded-lg font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
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
        
//         {/* ... Rest of your code (Posts/Saved section) ... */}
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
import { Grid3X3, Bookmark, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser, setUserProfile } from '@/redux/authSlice';

const API_URL = import.meta.env.VITE_API_URL;

// Followers/Following List Modal Component
const FollowListModal = ({ isOpen, onClose, title, users, currentUserId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const [followingState, setFollowingState] = useState(
    user?.following || []
  );

  const handleFollowToggle = async (targetUserId) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const isCurrentlyFollowing = followingState.includes(targetUserId);
        const updatedFollowing = isCurrentlyFollowing
          ? followingState.filter(id => id !== targetUserId)
          : [...followingState, targetUserId];

        setFollowingState(updatedFollowing);
        dispatch(setAuthUser({ ...user, following: updatedFollowing }));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleUserClick = (userId) => {
    onClose();
    navigate(`/profile/${userId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border-gray-800 text-white">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg font-semibold">{title}</DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="max-h-[400px] overflow-y-auto">
          {users && users.length > 0 ? (
            <div className="space-y-3">
              {users.map((followUser) => {
                const isFollowing = followingState.includes(followUser._id);
                const isSelf = followUser._id === currentUserId;

                return (
                  <div key={followUser._id} className="flex items-center justify-between py-2">
                    <div 
                      className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80"
                      onClick={() => handleUserClick(followUser._id)}
                    >
                      <Avatar className="h-11 w-11 border border-gray-700">
                        <AvatarImage src={followUser.profilePicture || 'https://i.pravatar.cc/40'} />
                        <AvatarFallback className="bg-gray-700 text-white">
                          {followUser.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-white truncate">
                          {followUser.username}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {followUser.bio || 'No bio'}
                        </p>
                      </div>
                    </div>
                    
                    {!isSelf && (
                      <Button
                        onClick={() => handleFollowToggle(followUser._id)}
                        variant={isFollowing ? "secondary" : "default"}
                        className={`h-8 px-4 text-xs font-semibold ${
                          isFollowing
                            ? 'bg-gray-800 text-white hover:bg-gray-700'
                            : 'bg-[#0095F6] text-white hover:bg-[#1877F2]'
                        }`}
                      >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);

  const { userProfile, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user?.following?.includes(userProfile?._id);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  const handleFollowOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/user/followorunfollow/${userProfile?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedFollowing = isFollowing
          ? user.following.filter(id => id !== userProfile?._id)
          : [...user.following, userProfile?._id];

        const updatedFollowers = isFollowing
          ? userProfile.followers.filter(id => id !== user._id)
          : [...userProfile.followers, user._id];

        dispatch(setAuthUser({ ...user, following: updatedFollowing }));
        dispatch(setUserProfile({ ...userProfile, followers: updatedFollowers }));
        
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10 bg-[#0F1115] min-h-screen'>
      <div className='flex flex-col gap-20 p-8 w-full'>
        <div className='grid grid-cols-2 gap-8'>
          {/* Avatar Section */}
          <section className='flex items-center justify-center'>
            <Avatar className='h-40 w-40 border-4 border-gray-800'>
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback className="bg-gray-800 text-white text-4xl">
                {userProfile?.username?.[0]?.toUpperCase() || 'CN'}
              </AvatarFallback>
            </Avatar>
          </section>

          {/* Profile Info Section */}
          <section>
            <div className='flex flex-col gap-5'>
              {/* Stats */}
              <div className='flex items-center gap-6 text-white'>
                <p className="text-base">
                  <span className='font-semibold text-lg'>{userProfile?.posts?.length || 0} </span>
                  Bài viết
                </p>
                <button
                  onClick={() => setFollowersModalOpen(true)}
                  className="text-base hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <span className='font-semibold text-lg'>{userProfile?.followers?.length || 0} </span>
                  Người theo dõi
                </button>
                <button
                  onClick={() => setFollowingModalOpen(true)}
                  className="text-base hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <span className='font-semibold text-lg'>{userProfile?.following?.length || 0} </span>
                  Đang theo dõi
                </button>
              </div>

              {/* Bio Section */}
              <div className='flex flex-col gap-2'>
                <span className="text-xl font-bold tracking-tight text-white">
                  {userProfile?.bio || 'No Bio Yet'}
                </span>
                <Badge className='w-fit bg-gray-800 text-gray-200 border-gray-700' variant='secondary'>
                  <AtSign className="h-3 w-3" /> 
                  <span className='pl-1'>{userProfile?.username}</span>
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 w-full">
              {isLoggedInUserProfile ? (
                <Link to="/account/edit" className="block w-full">
                  <Button
                    variant="secondary"
                    className="w-full h-11 rounded-lg text-sm font-semibold bg-gray-800 hover:bg-gray-700 text-white border-gray-700 transition-colors"
                  >
                    Chỉnh sửa trang cá nhân
                  </Button>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleFollowOrUnfollow}
                    className={`h-11 rounded-lg font-semibold transition-colors ${
                      isFollowing
                        ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                        : 'bg-[#0095F6] hover:bg-[#1877F2] text-white'
                    }`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>

                  <Button
                    variant="secondary"
                    className="h-11 rounded-lg font-semibold bg-gray-800 hover:bg-gray-700 text-white border-gray-700 transition-colors"
                  >
                    Message
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Posts/Saved Tabs */}
        <div className='border-t border-gray-800'>
          <div className="grid grid-cols-2 border-t border-gray-800">
            <button
              onClick={() => handleTabChange('posts')}
              className={`flex justify-center items-center py-4 border-t-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Grid3X3 size={22} />
            </button>

            <button
              onClick={() => handleTabChange('saved')}
              className={`flex justify-center items-center py-4 border-t-2 transition-colors ${
                activeTab === 'saved'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Bookmark size={22} />
            </button>
          </div>

          {/* Posts Grid */}
          <div className='grid grid-cols-3 gap-1 mt-4'>
            {displayedPost && displayedPost.length > 0 ? (
              displayedPost.map((post) => (
                <div key={post?._id} className='relative group cursor-pointer'>
                  <img 
                    src={post.image} 
                    alt='postimage' 
                    className='rounded-sm w-full aspect-square object-cover' 
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='flex items-center text-white space-x-4'>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <Heart fill="white" />
                        <span className="font-semibold">{post?.likes?.length || 0}</span>
                      </button>
                      <button className='flex items-center gap-2 hover:text-gray-300'>
                        <MessageCircle fill="white" />
                        <span className="font-semibold">{post?.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500 text-lg">No posts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      <FollowListModal
        isOpen={followersModalOpen}
        onClose={() => setFollowersModalOpen(false)}
        title="Người theo dõi"
        users={userProfile?.followers}
        currentUserId={user?._id}
      />

      {/* Following Modal */}
      <FollowListModal
        isOpen={followingModalOpen}
        onClose={() => setFollowingModalOpen(false)}
        title="Đang theo dõi"
        users={userProfile?.following}
        currentUserId={user?._id}
      />
    </div>
  );
};

export default Profile;