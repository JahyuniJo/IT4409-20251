import { X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";
import "./SwitchAccountModal.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function SwitchAccountModal({ onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/v1/user/login`,
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success("Đã chuyển tài khoản");
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="switch-account-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="logo">Instagram</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="email"
            placeholder="Số điện thoại, tên người dùng hoặc email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="forgot">Quên mật khẩu?</div>
      </div>
    </div>
  );
}
