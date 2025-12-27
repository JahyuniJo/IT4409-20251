// import React, { useEffect, useState } from 'react'
// import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from './ui/dialog'
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
// import { Link } from 'react-router-dom'
// import { MoreHorizontal } from 'lucide-react'
// import { Button } from './ui/button'
// import { useDispatch, useSelector } from 'react-redux'
// import axios from 'axios'
// import { toast } from 'sonner'
// import { setPosts, setSelectedPost } from '@/redux/postSlice'
// import { setAuthUser } from '@/redux/authSlice'
// import CommentItem from "./CommentItem";

// const API_URL = import.meta.env.VITE_API_URL;

// const CommentDialog = ({ open, onClose, post }) => {
//   const [text, setText] = useState("");
//   const [replyTo, setReplyTo] = useState(null);
//   const { posts } = useSelector(store => store.post);
//   const post = props.post;
//   const { user } = useSelector(store => store.auth); // Lấy user để xác thực
//   const dispatch = useDispatch();
//   const isFollowing = user?.following?.includes(post?.author?._id);

//   const changeEventHandler = (e) => {
//     const inputText = e.target.value;
//     setText(inputText.trim() ? inputText : "");
//   }

//   // Logic xóa bài viết 
//   const deletePostHandler = async () => {
//     try {
//       if (!post?._id) return;
//       const res = await axios.delete(`${API_URL}/api/v1/post/delete/${post?._id}`, { withCredentials: true })
//       if (res.data.success) {
//         const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
//         dispatch(setPosts(updatedPostData));
//         toast.success(res.data.message);
//         onClose();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Error deleting post");
//     }
//   }

//   const sendMessageHandler = async () => {
//     try {
//       const res = await axios.post(`${API_URL}/api/v1/post/${post?._id}/comment`, { text, parentId: replyTo }, {
//         headers: { 'Content-Type': 'application/json' },
//         withCredentials: true
//       });

//       if (res.data.success) {
//         const updatedPosts = posts.map(p =>
//           p._id === post._id
//             ? { ...p, comments: [...p.comments, res.data.comment] }
//             : p
//         );
//         dispatch(setPosts(updatedPosts));
//         setReplyTo(null);
//         setText("");

//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }


//   const followOrUnfollowHandler = async () => {
//     try {
//       const res = await axios.post(
//         `${API_URL}/api/v1/user/followorunfollow/${post.author._id}`,
//         {},
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         dispatch(setAuthUser({
//           ...user,
//           following: isFollowing
//             ? user.following.filter(id => id !== post.author._id)
//             : [...user.following, post.author._id]
//         }));

//         toast.success(res.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Hàm xây dựng cây bình luận từ danh sách phẳng
//   const buildCommentTree = (comments) => {
//     const map = {};
//     const roots = [];

//     comments.forEach(c => {
//       map[c._id] = { ...c, replies: [] };
//     });

//     comments.forEach(c => {
//       if (c.parentId) {
//         map[c.parentId]?.replies.push(map[c._id]);
//       } else {
//         roots.push(map[c._id]);
//       }
//     });

//     return roots;
//   };
//   const treeComments = buildCommentTree(selectedPost?.comments || []);
//   // Hàm cập nhật comment trong cây
//   const handleEditComment = (updatedComment) => {
//     const updatedPosts = posts.map(p =>
//       p._id === selectedPost._id
//         ? {
//           ...p,
//           comments: p.comments.map(c =>
//             c._id === updatedComment._id ? updatedComment : c
//           )
//         }
//         : p
//     );

//     dispatch(setPosts(updatedPosts));
//     dispatch(setSelectedPost(
//       updatedPosts.find(p => p._id === selectedPost._id)
//     ));
//   };

//   const handleDeleteComment = (commentId) => {
//     const updatedPosts = posts.map(p =>
//       p._id === selectedPost._id
//         ? {
//           ...p,
//           comments: p.comments.filter(c => c._id !== commentId)
//         }
//         : p
//     );

//     dispatch(setPosts(updatedPosts));
//     dispatch(setSelectedPost(
//       updatedPosts.find(p => p._id === selectedPost._id)
//     ));
//   };




//   // Hàm gửi reply từ CommentItem
//   const sendReplyHandler = async (text, parentId) => {
//     try {
//       const res = await axios.post(
//         `${API_URL}/api/v1/post/${selectedPost._id}/comment`,
//         { text, parentId },
//         { withCredentials: true }
//       );

//       if (res.data.success) {
//         const newComment = res.data.comment;

//         const updatedPosts = posts.map(post =>
//           post._id === selectedPost._id
//             ? { ...post, comments: [...post.comments, newComment] }
//             : post
//         );
//         const updatedSelectedPost = {
//           ...selectedPost,
//           comments: [...selectedPost.comments, res.data.comment],
//         };
//         dispatch(setPosts(updatedPosts));
//         dispatch(setSelectedPost(updatedSelectedPost));
//         setReplyTo(null);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };




//   return (
//     <Dialog open={open} onOpenChange={(value) => {
//       if (!value) onClose();
//     }}>


//       <DialogContent
//         className="max-w-5xl p-0 flex flex-col md:flex-row h-[90vh] md:h-[600px] bg-zinc-950 border-zinc-800 text-white overflow-hidden"
//       ><DialogHeader>
//           <DialogTitle></DialogTitle>
//         </DialogHeader>
//         {/* Left: Image */}
//         <div className='hidden md:flex w-3/5 bg-black items-center justify-center border-r border-zinc-800'>
//           <img
//             src={post?.image}
//             alt="post_img"
//             className='w-full h-full object-contain'
//           />
//         </div>

//         {/* Right: Content */}
//         <div className='w-full md:w-2/5 flex flex-col h-full bg-black'>

//           {/* Header */}
//           <div className='flex items-center justify-between p-4 border-b border-zinc-800'>
//             <div className='flex gap-3 items-center'>
//               <Avatar className="h-8 w-8">
//                 <AvatarImage src={selectedPost?.author?.profilePicture} />
//                 <AvatarFallback>CN</AvatarFallback>
//               </Avatar>
//               <Link className='font-semibold text-sm text-white hover:text-zinc-400'>
//                 {selectedPost?.author?.username}
//               </Link>
//             </div>

//             {/* More Options Dialog inside Comment Dialog */}
//             <Dialog>
//               <DialogTrigger asChild>
//                 <MoreHorizontal className='cursor-pointer text-white hover:opacity-50' size={20} />
//               </DialogTrigger>
//               <DialogContent className="flex flex-col items-center text-sm text-center p-0 overflow-hidden max-w-[400px] bg-zinc-900 border-none rounded-xl">

//                 {/* Logic xác thực Unfollow */}
//                 {selectedPost.author?._id !== user?._id && (
//                   <Button
//                     onClick={followOrUnfollowHandler}
//                     variant="ghost"
//                     className={`cursor-pointer w-full font-bold border-b border-zinc-800 rounded-none h-12 ${isFollowing ? 'text-[#ED4956]' : 'text-[#0095f6]'}`}>
//                     {isFollowing ? 'Unfollow' : 'Follow'}
//                   </Button>
//                 )}

//                 <Button variant="ghost" className="cursor-pointer w-full text-white border-b border-zinc-800 rounded-none h-12 hover:bg-zinc-800">
//                   Add to favorites
//                 </Button>

//                 {/* Logic xác thực Delete */}
//                 {user?._id === selectedPost?.author?._id && (
//                   <Button
//                     onClick={deletePostHandler}
//                     variant="ghost"
//                     className="cursor-pointer w-full text-[#ED4956] font-bold border-b border-zinc-800 rounded-none h-12 hover:bg-zinc-800 hover:text-[#ED4956]"
//                   >
//                     Delete
//                   </Button>
//                 )}

//                 <DialogTrigger asChild>
//                   <Button variant="ghost" className="cursor-pointer w-full text-white h-12 hover:bg-zinc-800">
//                     Cancel
//                   </Button>
//                 </DialogTrigger>
//               </DialogContent>
//             </Dialog>
//           </div>

//           {/* Comment List */}
//           <div className='flex-1 overflow-y-auto p-4 custom-scrollbar'>
//             {treeComments.length > 0 ? (
//               treeComments.map(c => (
//                 <CommentItem
//                   key={c._id}
//                   comment={c}
//                   onReply={sendReplyHandler}
//                   onEdit={handleEditComment}
//                   onDelete={handleDeleteComment}
//                 />


//               ))
//             ) : (
//               <div className="text-zinc-500 text-sm text-center">
//                 No comments yet.
//               </div>
//             )}

//           </div>

//           {/* Input Area */}
//           <div className='p-4 border-t border-zinc-800'>
//             <div className='flex items-center gap-3'>
//               <input
//                 type="text"
//                 value={text}
//                 onChange={changeEventHandler}
//                 placeholder='Add a comment...'
//                 className='flex-1 bg-transparent outline-none text-sm text-white placeholder-zinc-500'
//               />
//               <button
//                 disabled={!text.trim()}
//                 onClick={sendMessageHandler}
//                 className={`text-sm font-semibold ${text.trim() ? 'text-[#0095f6] hover:text-white' : 'text-[#0095f6]/50 cursor-default'}`}
//               >
//                 Post
//               </button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default CommentDialog;
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts } from '@/redux/postSlice';
import { setAuthUser } from '@/redux/authSlice';
import CommentItem from './CommentItem';

const API_URL = import.meta.env.VITE_API_URL;

const CommentDialog = ({ open, onClose, postId }) => {
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const { posts } = useSelector(store => store.post);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const post = posts.find(p => p._id === postId);
  if (!post) return null;

  const isFollowing = user?.following?.includes(post.author?._id);

  /* -------------------- helpers -------------------- */

  const buildCommentTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach(c => {
      map[c._id] = { ...c, replies: [] };
    });

    comments.forEach(c => {
      if (c.parentId) {
        map[c.parentId]?.replies.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });

    return roots;
  };

  const treeComments = buildCommentTree(post.comments || []);

  /* -------------------- handlers -------------------- */

  const sendCommentHandler = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/v1/post/${post._id}/comment`,
        { text, parentId: replyTo },
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPosts = posts.map(p =>
          p._id === post._id
            ? { ...p, comments: [...p.comments, res.data.comment] }
            : p
        );

        dispatch(setPosts(updatedPosts));
        setText('');
        setReplyTo(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${API_URL}/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setPosts(posts.filter(p => p._id !== post._id)));
        toast.success(res.data.message);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = (updatedComment) => {
    const updatedPosts = posts.map(p =>
      p._id === post._id
        ? {
          ...p,
          comments: p.comments.map(c =>
            c._id === updatedComment._id ? updatedComment : c
          )
        }
        : p
    );

    dispatch(setPosts(updatedPosts));
  };

  const handleDeleteComment = (commentId) => {
    const updatedPosts = posts.map(p =>
      p._id === post._id
        ? {
          ...p,
          comments: p.comments.filter(c => c._id !== commentId)
        }
        : p
    );

    dispatch(setPosts(updatedPosts));
  };


  const sendReplyHandler = async (text, parentId) => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/v1/post/${post._id}/comment`,
        { text, parentId },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setPosts(
          posts.map(p =>
            p._id === post._id
              ? { ...p, comments: [...p.comments, res.data.comment] }
              : p
          )
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* -------------------- render -------------------- */
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl p-0 flex h-[90vh] bg-zinc-950 border-zinc-800 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>

        {/* LEFT IMAGE */}
        <div className="hidden md:flex w-3/5 bg-black items-center justify-center border-r border-zinc-800">
          <img
            src={post.image}
            alt="post"
            className="w-full h-full object-contain"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="w-full md:w-2/5 flex flex-col bg-black">

          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Link className="font-semibold text-sm">
                {post.author?.username}
              </Link>
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

          {/* COMMENTS */}
          <div className="flex-1 overflow-y-auto p-4">
            {treeComments.length ? (
              treeComments.map(c => (
                <CommentItem
                  key={c._id}
                  comment={c}
                  onReply={sendReplyHandler}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              ))
            ) : (
              <p className="text-center text-zinc-500 text-sm">
                No comments yet
              </p>
            )}
          </div>

          {/* INPUT */}
          <div className="p-4 border-t border-zinc-800 flex items-center gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button
              onClick={sendCommentHandler}
              disabled={!text.trim()}
              className="text-blue-500 font-semibold disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
