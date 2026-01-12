import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';
import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
    Play,
    Volume2,
    VolumeX,
    Smile,
} from 'lucide-react';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const PostDetailModal = ({ post, isOpen, onClose }) => {
    const [text, setText] = useState('');
    const [comments, setComments] = useState([]);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [bookmarked, setBookmarked] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);
    const inputRef = useRef(null);
    const { user } = useSelector((store) => store.auth);
    const { posts } = useSelector((store) => store.post);
    const dispatch = useDispatch();

    // Determine if the content is a video (reel or video post)
    const isVideo = post?.video || post?.mediaType === 'video';
    const mediaSource = post?.video || post?.image;

    useEffect(() => {
        if (post) {
            setComments(post.comments || []);
            setLiked(post.likes?.includes(user?._id) || false);
            setLikeCount(post.likes?.length || 0);
            setBookmarked(user?.bookmarks?.includes(post._id) || false);
        }
    }, [post, user]);

    // Reset video when modal closes
    useEffect(() => {
        if (!isOpen && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    }, [isOpen]);

    // Auto-play video when modal opens
    useEffect(() => {
        if (isOpen && isVideo && videoRef.current) {
            videoRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    }, [isOpen, isVideo]);

    const handleLike = async () => {
        if (!post) return;
        try {
            // Determine if it's a reel or post based on endpoint
            const endpoint = post.video
                ? `${API_URL}/api/v1/reel/${post._id}/${liked ? 'dislike' : 'like'}`
                : `${API_URL}/api/v1/post/${post._id}/${liked ? 'dislike' : 'like'}`;

            const res = await axios.get(endpoint, { withCredentials: true });
            if (res.data.success) {
                const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
                setLikeCount(newLikeCount);
                setLiked(!liked);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Action failed');
        }
    };

    const handleBookmark = async () => {
        if (!post) return;
        try {
            const endpoint = post.video
                ? `${API_URL}/api/v1/reel/${post._id}/bookmark`
                : `${API_URL}/api/v1/post/${post._id}/bookmark`;

            const res = await axios.get(endpoint, { withCredentials: true });
            if (res.data.success) {
                setBookmarked(res.data.type === 'saved');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Bookmark failed');
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!text.trim() || !post) return;

        try {
            setSubmitting(true);
            const endpoint = post.video
                ? `${API_URL}/api/v1/reel/${post._id}/comment`
                : `${API_URL}/api/v1/post/${post._id}/comment`;

            const res = await axios.post(
                endpoint,
                { text },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                const newComment = res.data.comment;
                setComments([...comments, newComment]);
                setText('');
                toast.success('Comment posted');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    const formatTimeAgo = (date) => {
        if (!date) return '';
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
        return past.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' });
    };

    if (!post) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[1100px] max-h-[90vh] p-0 bg-[#000] border-gray-800 overflow-hidden rounded-lg">
                <div className="flex h-[85vh]">
                    {/* Left side - Media */}
                    <div className="flex-1 bg-black flex items-center justify-center relative min-w-0">
                        {isVideo ? (
                            <div className="relative w-full h-full cursor-pointer" onClick={togglePlay}>
                                <video
                                    ref={videoRef}
                                    src={mediaSource}
                                    className="w-full h-full object-contain"
                                    loop
                                    muted={isMuted}
                                    playsInline
                                />
                                {!isPlaying && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="bg-black/50 rounded-full p-5 backdrop-blur-sm">
                                            <Play className="w-14 h-14 text-white" fill="white" />
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={toggleMute}
                                    className="absolute bottom-4 right-4 bg-black/60 rounded-full p-2.5 hover:bg-black/80 transition-colors backdrop-blur-sm"
                                >
                                    {isMuted ? (
                                        <VolumeX className="w-5 h-5 text-white" />
                                    ) : (
                                        <Volume2 className="w-5 h-5 text-white" />
                                    )}
                                </button>
                            </div>
                        ) : (
                            <img
                                src={mediaSource}
                                alt={post.caption || 'Post'}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>

                    {/* Right side - Details */}
                    <div className="w-[400px] flex flex-col bg-[#000] border-l border-gray-800">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <Link to={`/profile/${post.author?._id}`} onClick={onClose}>
                                    <Avatar className="w-8 h-8 ring-2 ring-pink-500 ring-offset-2 ring-offset-black cursor-pointer">
                                        <AvatarImage src={post.author?.profilePicture} />
                                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-semibold">
                                            {post.author?.username?.[0]?.toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/profile/${post.author?._id}`}
                                        className="font-semibold text-white text-sm hover:opacity-80 transition-opacity"
                                        onClick={onClose}
                                    >
                                        {post.author?.username}
                                    </Link>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-400 text-sm">{formatTimeAgo(post.createdAt)}</span>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-white transition-colors p-1">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Caption & Comments */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-hide">
                            {/* Caption */}
                            {post.caption && (
                                <div className="flex gap-3">
                                    <Link to={`/profile/${post.author?._id}`} onClick={onClose} className="flex-shrink-0">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={post.author?.profilePicture} />
                                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                                                {post.author?.username?.[0]?.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm leading-relaxed">
                                            <Link
                                                to={`/profile/${post.author?._id}`}
                                                className="font-semibold mr-1.5 hover:opacity-80"
                                                onClick={onClose}
                                            >
                                                {post.author?.username}
                                            </Link>
                                            <span className="text-gray-100">{post.caption}</span>
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1.5">{formatTimeAgo(post.createdAt)}</p>
                                    </div>
                                </div>
                            )}

                            {/* Comments */}
                            {comments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <h3 className="text-white text-xl font-bold mb-1">No comments yet.</h3>
                                    <p className="text-gray-500 text-sm">Start the conversation.</p>
                                </div>
                            ) : (
                                comments.map((comment, idx) => (
                                    <div key={comment._id || idx} className="flex gap-3 group">
                                        <Link to={`/profile/${comment.author?._id}`} onClick={onClose} className="flex-shrink-0">
                                            <Avatar className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity">
                                                <AvatarImage src={comment.author?.profilePicture} />
                                                <AvatarFallback className="bg-gray-700 text-white text-xs">
                                                    {comment.author?.username?.[0]?.toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm leading-relaxed">
                                                <Link
                                                    to={`/profile/${comment.author?._id}`}
                                                    className="font-semibold mr-1.5 hover:opacity-80"
                                                    onClick={onClose}
                                                >
                                                    {comment.author?.username}
                                                </Link>
                                                <span className="text-gray-100">{comment.text}</span>
                                            </p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-gray-500 text-xs">{formatTimeAgo(comment.createdAt)}</span>
                                                <button className="text-gray-500 text-xs font-semibold hover:text-gray-300">Like</button>
                                                <button className="text-gray-500 text-xs font-semibold hover:text-gray-300">Reply</button>
                                            </div>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-300">
                                            <Heart className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-800 px-4 py-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleLike}
                                        className="hover:opacity-70 transition-all active:scale-90"
                                    >
                                        {liked ? (
                                            <FaHeart className="w-6 h-6 text-red-500 animate-[heartBeat_0.3s_ease-in-out]" />
                                        ) : (
                                            <FaRegHeart className="w-6 h-6 text-white hover:text-gray-300" />
                                        )}
                                    </button>
                                    <button
                                        onClick={focusInput}
                                        className="hover:opacity-70 transition-opacity"
                                    >
                                        <MessageCircle className="w-6 h-6 text-white hover:text-gray-300" />
                                    </button>
                                    <button className="hover:opacity-70 transition-opacity">
                                        <Send className="w-6 h-6 text-white hover:text-gray-300" />
                                    </button>
                                </div>
                                <button
                                    onClick={handleBookmark}
                                    className="hover:opacity-70 transition-all active:scale-90"
                                >
                                    {bookmarked ? (
                                        <FaBookmark className="w-6 h-6 text-white" />
                                    ) : (
                                        <FaRegBookmark className="w-6 h-6 text-white hover:text-gray-300" />
                                    )}
                                </button>
                            </div>

                            <p className="text-white font-semibold text-sm">{likeCount.toLocaleString()} likes</p>
                            <p className="text-gray-500 text-[10px] uppercase mt-1 tracking-wide">
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* Comment Input - Instagram Style */}
                        <form onSubmit={handleComment} className="border-t border-gray-800 px-4 py-3">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-white transition-colors"
                                    onClick={() => {/* Emoji picker would go here */ }}
                                >
                                    <Smile className="w-6 h-6" />
                                </button>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="flex-1 bg-transparent text-white placeholder:text-gray-500 outline-none text-sm py-1"
                                />
                                <button
                                    type="submit"
                                    disabled={!text.trim() || submitting}
                                    className={`text-sm font-semibold transition-all ${text.trim() && !submitting
                                        ? 'text-blue-500 hover:text-white cursor-pointer'
                                        : 'text-blue-500/40 cursor-default'
                                        }`}
                                >
                                    {submitting ? (
                                        <span className="animate-pulse">...</span>
                                    ) : (
                                        'Post'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <style>{`
          @keyframes heartBeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.2); }
            50% { transform: scale(0.95); }
            100% { transform: scale(1); }
          }
          
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
            </DialogContent>
        </Dialog>
    );
};

export default PostDetailModal;
