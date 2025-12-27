import React, { useRef, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2, ImagePlus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const API_URL = import.meta.env.VITE_API_URL;

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  }

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/v1/post/addpost`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        setCaption("");
        setImagePreview("");
        setFile("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const clearImageHandler = () => {
    setImagePreview("");
    setFile("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="
    p-0 bg-white rounded-xl 
    w-[520px] 
    font-sans text-gray-900
  ">

        {/* ===== Header ===== */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          {imagePreview ? (
            <button onClick={clearImageHandler} className="text-gray-600 hover:text-black">
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-5" />
          )}

          <h2 className="text-sm font-semibold tracking-wide">
            Create new post
          </h2>

          {imagePreview ? (
            <button
              disabled={loading}
              onClick={createPostHandler}
              className="text-sm font-semibold text-[#0095F6] disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Share"}
            </button>
          ) : (
            <div className="w-5" />
          )}
        </div>

        {/* ===== Body ===== */}
        {!imagePreview ? (
          /* STEP 1 – SELECT IMAGE */
          <div className="flex flex-col items-center justify-center h-[420px] gap-4">
            <ImagePlus className="h-20 w-20 text-gray-300" />
            <p className="text-base font-medium text-gray-700">
              Drag photos here
            </p>

            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              hidden
              onChange={fileChangeHandler}
            />

            <button
              onClick={() => imageRef.current.click()}
              className="px-6 py-2 text-sm font-semibold text-white bg-[#0095F6] rounded-md hover:bg-[#1877F2]"
            >
              Select from computer
            </button>
          </div>
        ) : (
          /* STEP 2 – PREVIEW + CAPTION */
          <div className="flex flex-col">
            <div className="bg-black flex justify-center max-h-[380px]">
              <img
                src={imagePreview}
                alt="preview"
                className="object-contain max-h-[380px]"
              />
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold">
                  {user?.username}
                </span>
              </div>

              <Textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="
              border-none resize-none p-0
              text-sm leading-5
              focus-visible:ring-0
              placeholder:text-gray-400
            "
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

  )
}

export default CreatePost