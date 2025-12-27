import React, { useState, useEffect } from 'react'
import { Grid3X3, Bookmark, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser, setUserProfile } from '@/redux/authSlice';
import CommentDialog from './CommentDialog';
const API_URL = import.meta.env.VITE_API_URL;

// Followers/Following List Modal Component
const FollowListModal = ({ isOpen, onClose, title, users, currentUserId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);

  const handleFollowToggle = async (targetUserId) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        const isFollowing = user.following.includes(targetUserId);

        // 1️⃣ Update auth.user.following
        const updatedFollowing = isFollowing
          ? user.following.filter(id => id !== targetUserId)
          : [...user.following, targetUserId];

        dispatch(setAuthUser({ ...user, following: updatedFollowing }));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("FOLLOW ERROR:", error.response?.data || error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };


  const handleUserClick = (userId) => {
    onClose();
    navigate(`/profile/${userId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {users?.map((followUser) => {
            const isFollowing = user.following.includes(followUser._id);
            const isSelf = followUser._id === currentUserId;

            return (
              <div key={followUser._id} className="flex justify-between items-center">
                <div
                  onClick={() => handleUserClick(followUser._id)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Avatar>
                    <AvatarImage src={followUser.profilePicture} />
                    <AvatarFallback>
                      {followUser.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{followUser.username}</span>
                </div>

                {!isSelf && (
                  <Button
                    onClick={() => handleFollowToggle(followUser._id)}
                    className={
                      isFollowing
                        ? 'bg-gray-700'
                        : 'bg-[#0095F6]'
                    }
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};


const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const openComment = (postId) => {
    setActivePostId(postId);
    setIsCommentOpen(true);
  };
  const location = useLocation();
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') === 'saved' ? 'saved' : 'posts';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'saved' || tab === 'posts') {
      setActiveTab(tab);
    }
  }, [location.search]);
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
                    className={`h-11 rounded-lg font-semibold transition-colors ${isFollowing
                      ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                      : 'bg-[#0095F6] hover:bg-[#1877F2] text-white'
                      }`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/chat?userId=${userProfile?._id}`)}
                    className="h-11 rounded-lg bg-gray-800 text-white"
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
              className={`flex justify-center items-center py-4 border-t-2 transition-colors ${activeTab === 'posts'
                ? 'border-white text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
            >
              <Grid3X3 size={22} />
            </button>

            <button
              onClick={() => handleTabChange('saved')}
              className={`flex justify-center items-center py-4 border-t-2 transition-colors ${activeTab === 'saved'
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
                <div
                  key={post._id}
                  className="relative group cursor-pointer"
                  onClick={() => openComment(post._id)}
                >

                  <img
                    src={post.image}
                    alt='postimage'
                    className='rounded-sm w-full aspect-square object-cover'
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-6 text-white font-semibold">
                      <div className="flex items-center gap-2">
                        <Heart fill="white" />
                        <span>{post.likes.length}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MessageCircle fill="white" />
                        <span>{post.comments.length}</span>
                      </div>
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
      <CommentDialog
        open={isCommentOpen}
        onClose={() => {
          setIsCommentOpen(false);
          setActivePostId(null);
        }}
        postId={activePostId}
      />
    </div>
  );
};

export default Profile;