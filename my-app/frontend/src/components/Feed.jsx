import React, { useState } from 'react';
import Stories from './Stories'; 
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock data for demonstration
const MOCK_POSTS = [
  {
    _id: '1',
    author: {
      _id: 'user1',
      username: 'john_doe',
      profilePicture: 'https://i.pravatar.cc/150?img=12'
    },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop',
    caption: 'Beautiful mountain view! 🏔️ #nature #photography',
    likes: 1234,
    comments: [
      {
        _id: 'c1',
        author: { username: 'jane_smith', profilePicture: 'https://i.pravatar.cc/40?img=5' },
        text: 'Stunning view! 😍',
      },
      {
        _id: 'c2',
        author: { username: 'mike_wilson', profilePicture: 'https://i.pravatar.cc/40?img=8' },
        text: 'Where is this place?',
      }
    ],
    createdAt: '2024-12-07T10:30:00Z'
  },
  {
    _id: '2',
    author: {
      _id: 'user2',
      username: 'sarah_travel',
      profilePicture: 'https://i.pravatar.cc/150?img=45'
    },
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&h=500&fit=crop',
    caption: 'Sunset vibes ✨',
    likes: 892,
    comments: [
      {
        _id: 'c3',
        author: { username: 'travel_lover', profilePicture: 'https://i.pravatar.cc/40?img=15' },
        text: 'Amazing colors!',
      }
    ],
    createdAt: '2024-12-07T09:15:00Z'
  },
  {
    _id: '3',
    author: {
      _id: 'user3',
      username: 'foodie_life',
      profilePicture: 'https://i.pravatar.cc/150?img=33'
    },
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=500&fit=crop',
    caption: 'Homemade pasta! 🍝 Recipe coming soon',
    likes: 2456,
    comments: [],
    createdAt: '2024-12-07T08:00:00Z'
  }
];

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [comment, setComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const handleCommentPost = () => {
    if (comment.trim()) {
      console.log('Comment posted:', comment);
      setComment('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentPost();
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 cursor-pointer">
            <AvatarImage src={post.author.profilePicture} alt={post.author.username} />
            <AvatarFallback>{post.author.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm cursor-pointer hover:text-gray-600">
              {post.author.username}
            </p>
            <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Post Image */}
      <div className="relative w-full aspect-square bg-gray-100">
        <img 
          src={post.image} 
          alt="Post" 
          className="w-full h-full object-cover"
          onDoubleClick={handleLike}
        />
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className="hover:text-gray-500 transition-colors"
            >
              <Heart 
                className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
            <button className="hover:text-gray-500 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="hover:text-gray-500 transition-colors">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button 
            onClick={() => setSaved(!saved)}
            className="hover:text-gray-500 transition-colors"
          >
            <Bookmark className={`w-6 h-6 ${saved ? 'fill-black' : ''}`} />
          </button>
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-sm mb-2">
          {likesCount.toLocaleString()} likes
        </p>

        {/* Caption */}
        <div className="text-sm mb-2">
          <span className="font-semibold mr-2">{post.author.username}</span>
          <span className="text-gray-800">{post.caption}</span>
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="text-sm">
            {!showAllComments && post.comments.length > 2 && (
              <button 
                onClick={() => setShowAllComments(true)}
                className="text-gray-500 mb-2 hover:text-gray-700"
              >
                View all {post.comments.length} comments
              </button>
            )}
            
            <div className="space-y-1">
              {(showAllComments ? post.comments : post.comments.slice(0, 2)).map((comment) => (
                <div key={comment._id} className="flex items-start gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={comment.author.profilePicture} />
                    <AvatarFallback>{comment.author.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <span className="font-semibold mr-2">{comment.author.username}</span>
                    <span className="text-gray-800">{comment.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Comment */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
          <button className="hover:text-gray-500">
            <Smile className="w-6 h-6" />
          </button>
          <Input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-none focus-visible:ring-0 px-0"
          />
          {comment.trim() && (
            <Button 
              onClick={handleCommentPost}
              variant="ghost" 
              className="text-blue-500 font-semibold hover:text-blue-600 hover:bg-transparent"
            >
              Post
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const Feed = () => {
  const [posts] = useState(MOCK_POSTS);

  return (
    <div className="w-full">
      {/* Stories - Full width of the feed area */}
      <Stories />

      {/* Posts Feed - Constrained width */}
      <div className="max-w-[470px] mx-auto px-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts yet</p>
            <p className="text-gray-400 text-sm mt-2">Start following people to see their posts</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}

        {posts.length > 0 && (
          <div className="text-center py-8">
            <Button variant="outline" className="w-full">
              Load More Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;