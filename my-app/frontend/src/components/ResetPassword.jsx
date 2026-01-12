import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, KeyRound, Mail, Loader2 } from 'lucide-react'

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
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
            <div className="relative w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Đặt lại mật khẩu
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Nhập OTP và mật khẩu mới
                        </p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                Email
                            </label>
                            <Input value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>

                        {/* OTP */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <KeyRound className="w-4 h-4 text-gray-500" />
                                Mã OTP
                            </label>
                            <Input value={otp} onChange={e => setOtp(e.target.value)} required />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-gray-500" />
                                Mật khẩu mới
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm */}
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Xác nhận mật khẩu"
                            required
                        />

                        <Button disabled={loading} className="w-full">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang cập nhật...
                                </span>
                            ) : (
                                "Xác nhận"
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Quay lại đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
