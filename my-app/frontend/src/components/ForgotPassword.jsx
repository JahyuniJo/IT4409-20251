import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Loader2 } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
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
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
            {/* Blob background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Quên mật khẩu
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Nhập email để nhận mã OTP
                        </p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-500" />
                                Email
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email đã đăng ký"
                                required
                            />
                        </div>

                        <Button disabled={loading} className="w-full">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang gửi...
                                </span>
                            ) : (
                                "Gửi mã OTP"
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Nhớ mật khẩu rồi?{' '}
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
