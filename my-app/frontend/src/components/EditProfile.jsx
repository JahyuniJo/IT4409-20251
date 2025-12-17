import { ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { setAuthUser, setUserProfile } from '@/redux/authSlice';
import { Button } from './ui/button';
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { toast } from 'sonner';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const [bio, setBio] = useState(user?.bio || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [preview, setPreview] = useState(user?.profilePicture || '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('gender', gender);
      if (file) formData.append('profilePhoto', file);

      const res = await axios.put(
        'http://localhost:8000/api/v1/user/profile/edit',
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        dispatch(setUserProfile(res.data.user));
        toast.success('Cập nhật hồ sơ thành công');
        navigate(`/profile/${res.data.user._id}`);
      }
    } catch (err) {
      toast.error('Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <Card className="w-full max-w-xl shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/profile/${user?._id}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <CardTitle className="text-xl">Chỉnh sửa tài khoản</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-24 h-24">
                <AvatarImage src={preview} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Input type="file" accept="image/*" onChange={onFileChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Giới thiệu</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Giới tính</label>
              <Input value={gender} onChange={(e) => setGender(e.target.value)} />
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfile;