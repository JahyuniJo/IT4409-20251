import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2, ImagePlus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

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
      const res = await axios.post('https://instaclone-g9h5.onrender.com/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        // Reset state after success (optional but good for UX)
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

  // Hàm để reset ảnh nếu muốn chọn lại (bổ trợ UI)
  const clearImageHandler = () => {
    setImagePreview("");
    setFile("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-white rounded-xl">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b px-4 py-3 bg-white z-10">
          {imagePreview ? (
            <Button variant="ghost" size="icon" onClick={clearImageHandler} className="h-8 w-8 -ml-2 text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="w-8"></div> // Spacer to center title
          )}
          
          <h2 className="text-base font-semibold text-gray-900">Tạo bài viết mới</h2>

          {/* Nút Post nằm ở góc phải Header - chỉ hiện khi có ảnh */}
          {imagePreview ? (
            loading ? (
              <div className="flex items-center text-blue-500 text-sm font-semibold">
                <Loader2 className='mr-1 h-4 w-4 animate-spin' />
              </div>
            ) : (
              <Button 
                variant="ghost" 
                onClick={createPostHandler} 
                className="text-[#0095F6] font-bold hover:bg-transparent hover:text-[#00376b] px-0 h-auto text-sm"
              >
                Chia sẻ
              </Button>
            )
          ) : (
            <div className="w-8"></div> // Spacer
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col">
          {!imagePreview ? (
            // TRƯỜNG HỢP 1: CHƯA CÓ ẢNH (Giao diện upload)
            <div className="flex flex-col items-center justify-center h-[400px] gap-4 p-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-100 rounded-full blur-xl opacity-50"></div>
                <ImagePlus className="w-20 h-20 text-gray-300 relative z-10" strokeWidth={1} />
              </div>
              <p className="text-xl font-light text-gray-600">Kéo ảnh vào đây</p>
              
              <input ref={imageRef} type='file' accept="image/*" className='hidden' onChange={fileChangeHandler} />
              
              <Button 
                onClick={() => imageRef.current.click()} 
                className='bg-[#0095F6] hover:bg-[#1877F2] text-sm font-semibold px-6 py-2 rounded-lg'
              >
                Chọn từ máy tính
              </Button>
            </div>
          ) : (
            // TRƯỜNG HỢP 2: ĐÃ CÓ ẢNH (Giao diện viết caption)
            <div className="flex flex-col max-h-[70vh] overflow-y-auto">
              {/* Preview Ảnh */}
              <div className="w-full bg-gray-100 flex items-center justify-center min-h-[300px]">
                 <img 
                    src={imagePreview} 
                    alt="preview_img" 
                    className='w-full h-auto max-h-[400px] object-contain' 
                 />
              </div>

              {/* Phần nhập Caption */}
              <div className="p-4 space-y-3">
                <div className='flex gap-3 items-center'>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profilePicture} alt="img" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className='font-semibold text-sm text-gray-900'>{user?.username}</span>
                </div>
                
                <Textarea 
                  value={caption} 
                  onChange={(e) => setCaption(e.target.value)} 
                  className="min-h-[100px] focus-visible:ring-0 border-none resize-none p-0 text-base placeholder:text-gray-400" 
                  placeholder="Caption ..." 
                />
              </div>
              
              {/* Nút thay đổi ảnh (phụ) */}
              <div className="px-4 pb-4 border-t pt-3 mt-auto">
                <input ref={imageRef} type='file' accept="image/*" className='hidden' onChange={fileChangeHandler} />
                <Button 
                   variant="outline"
                   onClick={() => imageRef.current.click()} 
                   className='w-full text-xs text-gray-500 border-gray-200'
                >
                  Thay đổi ảnh 
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost