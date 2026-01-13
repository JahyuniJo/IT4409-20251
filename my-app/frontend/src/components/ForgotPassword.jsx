import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Loader2, KeyRound, ArrowLeft } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        console.log("Gửi tới URL:", `${API_URL}/api/v1/user/forgot-password`);
        try {
            setLoading(true)
            const res = await axios.post(
                `${API_URL}/api/v1/user/forgot-password`,
                { email },
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/reset-password-otp', { state: { email } })
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể gửi OTP")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 relative overflow-hidden">
            {/* Background decorative elements (Đồng bộ với Signup) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Forgot Password Card */}
            <div className="relative w-full max-w-md">
                <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                    
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
                            <KeyRound className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            Quên mật khẩu?
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                Địa chỉ Email
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-purple-500 focus-visible:border-purple-500 transition-all"
                            />
                        </div>

                        <Button 
                            type="submit"
                            disabled={loading} 
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 shadow-lg shadow-purple-500/20 transition-all duration-300"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang gửi mã...
                                </span>
                            ) : (
                                "Gửi mã OTP"
                            )}
                        </Button>
                    </form>

                    {/* Back to Login */}
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

            {/* Keyframe Animations (Giống Signup) */}
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

export default ForgotPassword
