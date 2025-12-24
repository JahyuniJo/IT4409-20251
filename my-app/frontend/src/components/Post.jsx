import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'
import { setAuthUser } from '@/redux/authSlice'

const API_URL = import.meta.env.VITE_API_URL;

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const isLiked = post.likes.includes(user?._id);
    const likeCount = post.likes.length;
    const isBookmarked = user?.bookmarks?.includes(post._id);
    const isFollowing = user?.following?.includes(post.author?._id);

    // const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    // const [postLike, setPostLike] = useState(post.likes.length);
    // const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setText(e.target.value);
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = isLiked ? "dislike" : "like";

            const res = await axios.get(
                `${API_URL}/api/v1/post/${post._id}/${action}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                const updatedPosts = posts.map(p =>
                    p._id === post._id
                        ? {
                            ...p,
                            likes: isLiked
                                ? p.likes.filter(id => id !== user._id)
                                : [...p.likes, user._id],
                        }
                        : p
                );

                dispatch(setPosts(updatedPosts));
            }
        } catch (error) {
            console.log(error);
        }
    };


    const commentHandler = async () => {
        try {
            const res = await axios.post(`${API_URL}/api/v1/post/${post._id}/comment`, { text }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedPostData = posts.map(p =>
                    p._id === post._id
                        ? { ...p, comments: [...p.comments, res.data.comment] }
                        : p
                );

                dispatch(setPosts(updatedPostData));
                setText("");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`${API_URL}/api/v1/post/delete/${post?._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/api/v1/post/${post._id}/bookmark`,
                { withCredentials: true }
            );

            if (res.data.success) {
                const updatedBookmarks = isBookmarked
                    ? user.bookmarks.filter(id => id !== post._id)
                    : [...user.bookmarks, post._id];

                dispatch(setAuthUser({
                    ...user,
                    bookmarks: updatedBookmarks
                }));

                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const followOrUnfollowHandler = async () => {
        try {
            const res = await axios.post(
                `${API_URL}/api/v1/user/followorunfollow/${post.author._id}`,
                {},
                { withCredentials: true }
            );

            if (res.data.success) {
                dispatch(setAuthUser({
                    ...user,
                    following: isFollowing
                        ? user.following.filter(id => id !== post.author._id)
                        : [...user.following, post.author._id]
                }));

                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <div className="my-8 w-full max-w-[470px] mx-auto border-b border-gray-800 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between px-1 mb-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-1 ring-gray-800">
                        <AvatarImage src={post.author?.profilePicture} alt="author" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-[14px] text-white hover:text-gray-400 cursor-pointer">
                            {post.author?.username}
                        </span>
                        {user?._id === post.author?._id && (
                            <Badge variant="secondary" className="bg-zinc-800 text-gray-300 text-[10px] px-1.5 py-0 h-4">
                                Author
                            </Badge>
                        )}
                        <span className="text-gray-500">• 1h</span> {/* Mock time */}
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer text-white hover:text-gray-400" size={20} />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center p-0 overflow-hidden max-w-[400px] bg-zinc-900 border-none rounded-xl">
                        {post.author?._id !== user?._id && (
                            <Button
                                onClick={followOrUnfollowHandler}
                                variant="ghost"
                                className={`cursor-pointer w-full font-bold border-b border-zinc-800 rounded-none h-12 ${isFollowing ? 'text-[#ED4956]' : 'text-[#0095f6]'}`}>
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </Button>
                        )}

                        <Button variant="ghost" className="cursor-pointer w-full text-white border-b border-zinc-800 rounded-none h-12">
                            Add to favorites
                        </Button>
                        {user?._id === post.author?._id && (
                            <Button onClick={deletePostHandler} variant="ghost" className="cursor-pointer w-full text-[#ED4956] font-bold border-b border-zinc-800 rounded-none h-12">
                                Delete
                            </Button>
                        )}
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="cursor-pointer w-full text-white h-12 hover:bg-zinc-800">
                                Cancel
                            </Button>
                        </DialogTrigger>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Image Section */}
            <div className="rounded-sm overflow-hidden border border-zinc-800 bg-black">
                <img
                    src={post.image}
                    alt="post content"
                    className="w-full aspect-square object-contain"
                />
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-4">
                    {isLiked ? (
                        <FaHeart
                            onClick={likeOrDislikeHandler}
                            size={24}
                            className="cursor-pointer text-red-600"
                        />
                    ) : (
                        <FaRegHeart
                            onClick={likeOrDislikeHandler}
                            size={22}
                            className="cursor-pointer hover:text-gray-600"
                        />
                    )}
                    <MessageCircle
                        onClick={() => { dispatch(setSelectedPost(post)); setOpen(true); }}
                        className="text-white hover:text-gray-500 cursor-pointer"
                        size={24}
                    />
                    <Send className="text-white hover:text-gray-500 cursor-pointer" size={24} />
                </div>
                {isBookmarked ? (
                    <Bookmark
                        onClick={bookmarkHandler}
                        className="cursor-pointer text-white fill-white"
                        size={24}
                    />
                ) : (
                    <Bookmark
                        onClick={bookmarkHandler}
                        className="cursor-pointer text-white hover:text-gray-500"
                        size={24}
                    />
                )}

            </div>

            {/* Post Info */}
            <div className="px-1 mt-2">
                <span className="font-medium block mb-2">
                    {likeCount} likes
                </span>
                <div className="mt-1 text-sm">
                    <span className="font-semibold text-white mr-2">{post.author?.username}</span>
                    <span className="text-gray-100">{post.caption}</span>
                </div>

                {post.comments.length > 0 && (
                    <div
                        onClick={() => { dispatch(setSelectedPost(post)); setOpen(true); }}
                        className="mt-1.5 text-gray-500 cursor-pointer hover:text-gray-400 text-sm"
                    >
                        View all {post.comments.length} comments
                    </div>
                )}

            </div>

            {/* Comment Dialog */}
            <CommentDialog open={open} setOpen={setOpen} />

            {/* Input Field */}
            <div className="flex items-center justify-between mt-3 px-1">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={text}
                    onChange={changeEventHandler}
                    className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-sm py-1"
                />
                {text.trim() && (
                    <button
                        onClick={commentHandler}
                        className="text-[#0095f6] font-semibold text-sm ml-2 hover:text-white transition-colors"
                    >
                        Post
                    </button>
                )}
            </div>
        </div>
    )
}

export default Post;