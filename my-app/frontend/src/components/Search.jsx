import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FiSearch } from "react-icons/fi";

// Ảnh avatar mặc định phòng trường hợp user không có ảnh hoặc ảnh lỗi
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function Search() {
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [searchData, setSearchData] = useState([]); // Chứa danh sách user từ API
  const [input, setInput] = useState("");           // Từ khóa tìm kiếm
  const [loading, setLoading] = useState(false);    // Trạng thái loading (để hiện 3 chấm)

  // Lấy đường dẫn Server từ biến môi trường (hoặc dùng fallback localhost)
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

  // --- LOGIC GỌI API (Debounce) ---
  useEffect(() => {
    // 1. Nếu ô input rỗng -> Xóa ngay kết quả cũ
    if (!input.trim()) {
      setSearchData([]);
      return;
    }

    // 2. Tạo bộ đếm thời gian (Delay 500ms)
    const delayDebounceFn = setTimeout(async () => {
      try {
        setLoading(true); // Bật hiệu ứng loading

        // Gọi API Backend
        const res = await axios.get(
          `${serverUrl}/api/user/search?keyWord=${input}`,
          { withCredentials: true } // Quan trọng: Gửi kèm cookie/session nếu có
        );

        // Kiểm tra kết quả trả về từ Backend
        if (res.data.success) {
            setSearchData(res.data.users);
        }

      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        // Có thể set searchData rỗng hoặc hiện thông báo lỗi tùy ý
        setSearchData([]); 
      } finally {
        setLoading(false); // Tắt hiệu ứng loading dù thành công hay thất bại
      }
    }, 500); // Chờ 500ms sau khi người dùng ngừng gõ

    // 3. Cleanup: Hủy bộ đếm cũ nếu người dùng gõ tiếp
    return () => clearTimeout(delayDebounceFn);
  }, [input, serverUrl]);

  return (
    <div className="w-full min-h-screen bg-neutral-900 flex flex-col items-center pb-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="w-full flex items-center gap-4 p-6 sticky top-0 bg-neutral-900/95 backdrop-blur-sm z-20">
        <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-neutral-800 transition-colors group"
        >
            <MdOutlineKeyboardBackspace className="text-gray-300 w-7 h-7 group-hover:text-white transition-transform group-hover:-translate-x-1" />
        </button>
        <h2 className="text-white text-base font-bold tracking-wide">Tìm Kiếm</h2>
      </div>

      {/* --- SEARCH BAR (Giao diện Neumorphism) --- */}
      <div className="w-full flex justify-center mb-8 px-4">
        <div className="relative w-full max-w-[600px] group">
            <div className="w-full h-[60px] rounded-full bg-neutral-800 flex items-center px-6 gap-4 
                          shadow-[6px_6px_12px_#121212,-6px_-6px_12px_#2e2e2e] 
                          transition-all duration-300 focus-within:shadow-[inset_4px_4px_8px_#121212,inset_-4px_-4px_8px_#2e2e2e]">
            
            <FiSearch className="w-6 h-6 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
            
            <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                className="w-full h-full outline-none bg-transparent text-gray-100 text-lg placeholder-gray-500 font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
            />
            
            {/* Nút xóa nhanh text */}
            {input && (
                 <button 
                    onClick={() => { setInput(''); setSearchData([]); }} 
                    className="text-gray-500 hover:text-white text-sm font-bold px-2"
                 >
                   ✕
                 </button>
            )}
            </div>
        </div>
      </div>

      {/* --- LOADING STATUS (3 chấm nhảy) --- */}
      <div className="h-8 mb-2">
        {loading && (
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
            </div>
        )}
      </div>

      {/* --- DANH SÁCH KẾT QUẢ --- */}
      <div className="w-full flex flex-col items-center gap-4 px-4">
        {searchData.map((user) => (
            <div
              key={user._id} // Dùng _id từ MongoDB làm key
              className="w-full max-w-[600px] h-[80px] rounded-2xl bg-neutral-800/50 flex items-center gap-5 px-5 cursor-pointer 
                          border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800
                          transition-all duration-300 group"
              onClick={() => navigate(`/profile/${user._id}`)} // Chuyển trang sang profile user đó
            >
              {/* Avatar Container */}
              <div className="relative w-14 h-14 min-w-[56px]">
                  {/* Hiệu ứng viền gradient khi hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-[2px]"></div>
                  
                  <img
                    // Ưu tiên dùng profilePicture, fallback sang ảnh mặc định
                    src={user.profilePicture || DEFAULT_AVATAR}
                    onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                    alt="avatar"
                    className="relative w-full h-full rounded-full object-cover border-2 border-neutral-800 group-hover:border-transparent transition-all"
                  />
              </div>

              {/* User Info */}
              <div className="flex flex-col justify-center overflow-hidden flex-1">
                <div className="text-white text-lg font-semibold truncate group-hover:text-blue-400 transition-colors">
                  {user.username} {/* Tên đăng nhập */}
                </div>
                <div className="text-sm text-gray-400 font-medium truncate">
                  {user.fullname || user.name || "Người dùng"} {/* Tên đầy đủ */}
                </div>
              </div>
              
              {/* Icon mũi tên (chỉ hiện khi hover) */}
              <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <span className="text-gray-400 text-xl">›</span>
              </div>
            </div>
        ))}

        {/* --- EMPTY STATE (Khi không tìm thấy gì) --- */}
        {!loading && input.trim() && searchData.length === 0 && (
          <div className="flex flex-col items-center mt-10 opacity-60">
            <FiSearch className="w-12 h-12 text-gray-600 mb-4" />
            <p className="text-gray-400 text-base">Không tìm thấy kết quả nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;