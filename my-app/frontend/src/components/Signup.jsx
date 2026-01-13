import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "" // Thêm trường xác nhận mật khẩu
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State ẩn/hiện cho confirm pass

    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu khớp nhau trước khi gửi API
        if (input.password !== input.confirmPassword) {
            return toast.error("Mật khẩu xác nhận không khớp!");
        }

        try {
            setLoading(true);
            // Gửi dữ liệu đi (thường backend chỉ cần username, email, password)
            const { confirmPassword, ...signupData } = input;

            const res = await axios.post(`${API_URL}/api/v1/user/register`, signupData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate])

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            Tạo tài khoản mới
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Tham gia ngay và kết nối với bạn bè!
                        </p>
                    </div>

                    <form onSubmit={signupHandler} className="space-y-5">
                        {/* Username Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                Username
                            </label>
                            <Input
                                type="text"
                                name="username"
                                required
                                value={input.username}
                                onChange={changeEventHandler}
                                placeholder="Nhập tên người dùng"
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                Email
                            </label>
                            <Input
                                type="email"
                                name="email"
                                required
                                value={input.email}
                                onChange={changeEventHandler}
                                placeholder="Nhập email của bạn"
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gray-400" />
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={input.password}
                                    onChange={changeEventHandler}
                                    placeholder="Tạo mật khẩu mạnh"
                                    className="pr-12 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Input - NEW */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-gray-400" />
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    required
                                    value={input.confirmPassword}
                                    onChange={changeEventHandler}
                                    placeholder="Nhập lại mật khẩu"
                                    className={`pr-12 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-purple-500 ${input.confirmPassword && input.password !== input.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : ''
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {input.confirmPassword && input.password !== input.confirmPassword && (
                                <p className="text-[10px] text-red-400 mt-1 ml-1">Mật khẩu không trùng khớp</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all duration-300"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang xử lý...
                                </span>
                            ) : (
                                'Đăng Ký'
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}

export default Signup