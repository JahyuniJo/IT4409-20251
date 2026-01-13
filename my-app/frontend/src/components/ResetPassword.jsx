import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, KeyRound, Mail, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [email, setEmail] = useState(location.state?.email || "")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault()

        if (password.length < 6) {
            toast.error("Mật khẩu tối thiểu 6 ký tự")
            return
        }
        if (password !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp")
            return
        }

        try {
            setLoading(true)
            const res = await axios.post(
                `${API_URL}/api/v1/user/reset-password-otp`,
                { email, otp, password }
            )

            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/login')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP không hợp lệ")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            Đặt lại mật khẩu
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Vui lòng nhập mã OTP và mật khẩu mới của bạn
                        </p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                Email
                            </label>
                            <Input 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                            />
                        </div>

                        {/* OTP */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-gray-400" />
                                Mã OTP
                            </label>
                            <Input 
                                value={otp} 
                                onChange={e => setOtp(e.target.value)} 
                                required 
                                placeholder="Nhập mã 6 chữ số"
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-gray-400" />
                                Mật khẩu mới
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Tối thiểu 6 ký tự"
                                    className="pr-12 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Xác nhận mật khẩu mới"
                                className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-purple-500 ${
                                    confirmPassword && password !== confirmPassword ? 'border-red-500 ring-1 ring-red-500' : ''
                                }`}
                                required
                            />
                        </div>

                        <Button 
                            disabled={loading} 
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 transition-all duration-300"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang cập nhật...
                                </span>
                            ) : (
                                "Xác nhận đổi mật khẩu"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
                        <Link 
                            to="/login" 
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-purple-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại đăng nhập
                        </Link>
                    </div>
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

export default ResetPassword
