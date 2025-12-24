import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from '@/redux/authSlice';
import axios from 'axios';
import { toast } from 'sonner';
import SwitchAccountModal from "./SwitchAccountModal";
import {
  Home,
  Search,
  Compass,
  Send,
  Heart,
  PlusSquare,
  MoreHorizontal,
  Settings,
  Bookmark,
  Activity,
  Moon,
  AlertCircle,
  LogOut,
  Repeat
} from "lucide-react";

import CreatePost from "./CreatePost";
import "../App.css";
const API_URL = import.meta.env.VITE_API_URL;

function MenuItem({ icon, text, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`menu-item ${danger ? "danger" : ""}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}




export default function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(store => store.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification);
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);

  const isActive = (path) => location.pathname === path;
  // Hàm đăng xuất
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/user/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const unreadNotifications = likeNotification.length;


  // Thêm logic đóng menu khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMore(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);
  // Chỉ thêm sự kiện khi menu được mở tránh addEventListener nhiều lần
  useEffect(() => {
    if (!showMore) return;

    const handler = () => setShowMore(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [showMore]);

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img
            src="/instagram-logo.svg"
            alt="Instagram Logo"
            className="instagram-logo"
          />
        </div>

        <nav className="sidebar-menu">
          <Link
            to="/"
            className={`sidebar-item ${isActive("/") ? "active" : ""}`}
          >
            <Home size={24} />
            <span>Trang chủ</span>
          </Link>

          <button
            onClick={() => handleComingSoon("Tìm kiếm")}
            className="sidebar-item"
          >
            <Search size={24} />
            <span>Tìm kiếm</span>
          </button>

          <button
            onClick={() => handleComingSoon("Khám phá")}
            className="sidebar-item"
          >
            <Compass size={24} />
            <span>Khám phá</span>
          </button>

          <Link
            to="/chat"
            className={`sidebar-item ${isActive("/chat") ? "active" : ""}`}
          >
            <Send size={24} />
            <span>Tin nhắn</span>
          </Link>

          <button
            onClick={() => handleComingSoon("Thông báo")}
            className="sidebar-item relative"
          >
            <div className="relative">
              <Heart size={24} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {unreadNotifications}
                </span>
              )}
            </div>
            <span>Thông báo</span>
          </button>

          <button
            onClick={() => setOpen(true)}
            className="sidebar-item"
          >
            <PlusSquare size={24} />
            <span>Tạo</span>
          </button>

          <Link
            to={`/profile/${user?._id}`}
            className={`sidebar-item ${location.pathname.startsWith("/profile") ? "active" : ""
              }`}
          >
            <img
              src={user?.profilePicture || "https://i.pravatar.cc/40"}
              alt="avatar"
              className="sidebar-avatar"
            />
            <span>Trang cá nhân</span>
          </Link>
        </nav>

        <div className="mt-auto relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMore(prev => !prev);
            }}
            className="sidebar-item w-full"
          >
            <MoreHorizontal size={24} />
            <span>Xem thêm</span>
          </button>

          {showMore && (
            <div className="more-menu" onClick={(e) => e.stopPropagation()}>
              <MenuItem icon={<Settings size={18} />} text="Cài đặt" />
              <MenuItem icon={<Activity size={18} />} text="Hoạt động của bạn" />
              <MenuItem icon={<Bookmark size={18} />} text="Đã lưu" />
              <MenuItem icon={<Moon size={18} />} text="Chuyển chế độ" />
              <MenuItem icon={<AlertCircle size={18} />} text="Báo cáo sự cố" />

              <div className="menu-divider" />

              <MenuItem
                icon={<Repeat size={18} />}
                text="Chuyển tài khoản"
                onClick={() => {
                  setShowMore(false);
                  setShowSwitchAccount(true);
                }}
              />
              <MenuItem
                icon={<LogOut size={18} />}
                text="Đăng xuất"
                danger
                onClick={handleLogout}
              />
            </div>
          )}
        </div>

      </aside>
      {showSwitchAccount && (
        <SwitchAccountModal onClose={() => setShowSwitchAccount(false)} />
      )}
      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
}
