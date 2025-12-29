import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  Search,
  Compass,
  Send,
  Heart,
  PlusSquare,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import CreatePost from "./CreatePost";
import "../App.css";

export default function LeftSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(store => store.auth);
  const { likeNotification } = useSelector(store => store.realTimeNotification);
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleComingSoon = (feature) => {
    alert(`${feature} - Coming Soon!`);
  };

  const unreadNotifications = likeNotification.length;

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
            className={`sidebar-item ${
              location.pathname.startsWith("/profile") ? "active" : ""
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

        <div className="mt-auto">
          <button
            onClick={() => handleComingSoon("Xem thêm")}
            className="sidebar-item"
          >
            <MoreHorizontal size={24} />
            <span>Xem thêm</span>
          </button>
        </div>
      </aside>

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
}