// import React from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//   Home,
//   Search,
//   Compass,
//   Film,
//   Send,
//   Heart,
//   Settings,
//   MoreHorizontal,
//   LogOut,
// } from "lucide-react";
// import "../App.css";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 🔧 Temporary fake user (replace later when backend is ready)
//   const user = {
//     username: "demo_user",
//     avatarUrl: "https://i.pravatar.cc/40",
//   };

//   // 🔧 Temporary logout function
//   const logout = () => {
//     console.log("Logged out");
//     navigate("/login");
//   };

//   const isActive = (path) => location.pathname === path;

//   return (
//     <aside className="sidebar">
      
//       <div className="sidebar-logo">
//         <img
//           src="/instagram-logo.svg"
//           alt="Instagram Logo"
//           className="instagram-logo"
//         />
//       </div>

      
//       <nav className="sidebar-menu">
//         <Link
//           to="/"
//           className={`sidebar-item ${isActive("/") ? "active" : ""}`}
//         >
//           <Home size={24} />
//           <span>Trang chủ</span>
//         </Link>

//         <Link
//           to="/search"
//           className={`sidebar-item ${isActive("/search") ? "active" : ""}`}
//         >
//           <Search size={24} />
//           <span>Tìm kiếm</span>
//         </Link>

//         <Link
//           to="/explore"
//           className={`sidebar-item ${isActive("/explore") ? "active" : ""}`}
//         >
//           <Compass size={24} />
//           <span>Khám phá</span>
//         </Link>

//         <Link
//           to="/reels"
//           className={`sidebar-item ${isActive("/reels") ? "active" : ""}`}
//         >
//           <Film size={24} />
//           <span>Reels</span>
//         </Link>

//         <Link
//           to="/messages"
//           className={`sidebar-item ${isActive("/messages") ? "active" : ""}`}
//         >
//           <Send size={24} />
//           <span>Tin nhắn</span>
//         </Link>

//         <Link
//           to="/notifications"
//           className={`sidebar-item ${
//             isActive("/notifications") ? "active" : ""
//           }`}
//         >
//           <Heart size={24} />
//           <span>Thông báo</span>
//         </Link>

//         <Link
//           to={`/profile/${user.username}`}
//           className={`sidebar-item ${
//             location.pathname.startsWith("/profile") ? "active" : ""
//           }`}
//         >
//           <img
//             src={user.avatarUrl}
//             alt="avatar"
//             className="sidebar-avatar"
//           />
//           <span>Trang cá nhân</span>
//         </Link>

//         <Link
//           to="/settings"
//           className={`sidebar-item ${isActive("/settings") ? "active" : ""}`}
//         >
//           <Settings size={24} />
//           <span>Cài đặt</span>
//         </Link>

//         <button className="sidebar-item" onClick={() => alert("Tính năng sắp ra mắt!")}>
//           <MoreHorizontal size={24} />
//           <span>Xem thêm</span>
//         </button>

//         <button className="sidebar-item sidebar-logout" onClick={logout}>
//           <LogOut size={24} />
//           <span>Đăng xuất</span>
//         </button>
//       </nav>
//     </aside>
//   );
// }

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Compass,
  Film,
  Send,
  Heart,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import "../App.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔧 Temporary fake user (replace later when backend is ready)
  const user = {
    username: "demo_user",
    avatarUrl: "https://i.pravatar.cc/40",
  };

  const isActive = (path) => location.pathname === path;

  return (
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

        <Link
          to="/search"
          className={`sidebar-item ${isActive("/search") ? "active" : ""}`}
        >
          <Search size={24} />
          <span>Tìm kiếm</span>
        </Link>

        <Link
          to="/explore"
          className={`sidebar-item ${isActive("/explore") ? "active" : ""}`}
        >
          <Compass size={24} />
          <span>Khám phá</span>
        </Link>

        <Link
          to="/messages"
          className={`sidebar-item ${isActive("/messages") ? "active" : ""}`}
        >
          <Send size={24} />
          <span>Tin nhắn</span>
        </Link>

        <Link
          to="/notifications"
          className={`sidebar-item ${
            isActive("/notifications") ? "active" : ""
          }`}
        >
          <Heart size={24} />
          <span>Thông báo</span>
        </Link>

        <Link
          to={`/profile/${user.username}`}
          className={`sidebar-item ${
            location.pathname.startsWith("/profile") ? "active" : ""
          }`}
        >
          <img
            src={user.avatarUrl}
            alt="avatar"
            className="sidebar-avatar"
          />
          <span>Trang cá nhân</span>
        </Link>

        <Link
          to="/settings"
          className={`sidebar-item ${isActive("/settings") ? "active" : ""}`}
        >
          <Settings size={24} />
          <span>Cài đặt</span>
        </Link>

        <button className="sidebar-item" onClick={() => alert("Tính năng sắp ra mắt!")}>
          <MoreHorizontal size={24} />
          <span>Xem thêm</span>
        </button>
      </nav>
    </aside>
  );
}