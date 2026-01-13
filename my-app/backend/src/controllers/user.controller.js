// backend/src/controllers/user.controller.js
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
<<<<<<< HEAD
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';
=======
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

>>>>>>> ea4ed2a9326ecfed096a4b2ccc21f169d17da622
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const token = await jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        // Populate each post in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post && post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        );

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            gender: user.gender,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts.filter(post => post !== null)
        }

        return res
            .cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 1 * 24 * 60 * 60 * 1000
            })
            .json({
                message: `Welcome back ${user.username}`,
                success: true,
                user
            });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
// Forgot Password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Email không tồn tại"
        });
    }

    // 🔢 OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // hash OTP để lưu
    const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    user.resetPasswordOTP = hashedOTP;
    user.resetPasswordOTPExpire = Date.now() + 5 * 60 * 1000; // 5 phút

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        to: user.email,
        subject: "Mã xác thực đặt lại mật khẩu",
        html: `
            <h2>Mã OTP của bạn</h2>
            <h1 style="letter-spacing:4px">${otp}</h1>
            <p>Mã có hiệu lực trong 5 phút.</p>
        `
    });

    res.json({
        success: true,
        message: "OTP đã được gửi qua email"
    });
};

// Resert password 
export const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
        return res.status(400).json({
            success: false,
            message: "Thiếu thông tin"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Mật khẩu tối thiểu 6 ký tự"
        });
    }

    const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    const user = await User.findOne({
        email,
        resetPasswordOTP: hashedOTP,
        resetPasswordOTPExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "OTP không hợp lệ hoặc đã hết hạn"
        });
    }

    // 🔐 hash password mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // clear OTP
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;

    await user.save();

    res.json({
        success: true,
        message: "Đặt lại mật khẩu thành công"
    });
};
export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        let user = await User.findById(userId)
            .populate({
                path: 'posts',
                options: { sort: { createdAt: -1 } },
                populate: [
                    { path: 'author', select: 'username profilePicture' },
                    { path: 'comments', populate: { path: 'author', select: 'username profilePicture' } }
                ]
            })
            .populate({
                path: 'bookmarks',
                populate: [
                    { path: 'author', select: 'username profilePicture' },
                    { path: 'comments', populate: { path: 'author', select: 'username profilePicture' } }
                ]
            })
            .populate({
                path: 'followers',
                select: 'username profilePicture bio'
            })
            .populate({
                path: 'following',
                select: 'username profilePicture bio'
            });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) {
            user.profilePicture = cloudResponse.secure_url;
        } else if (profilePicture === '') {
            // If expressly setting to empty (deletion), fallback to default
            user.profilePicture = 'https://res.cloudinary.com/dva00tzke/image/upload/v1768276886/user_curjop.png?v=2';
        }

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const currentUser = await User.findById(req.id).select('following');

        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const suggestedUsers = await User.find({
            _id: {
                $nin: [...currentUser.following, req.id]
            }
        })
            .select("-password")
            .limit(10);

        if (!suggestedUsers || suggestedUsers.length === 0) {
            return res.status(200).json({
                message: 'Currently do not have any users',
                success: true,
                users: []
            });
        }

        return res.status(200).json({
            success: true,
            users: suggestedUsers
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id;
        const jiskoFollowKrunga = req.params.id;

        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        const isFollowing = user.following.includes(jiskoFollowKrunga);

        if (isFollowing) {
            // Unfollow logic
            await Promise.all([
                User.updateOne(
                    { _id: followKrneWala },
                    { $pull: { following: jiskoFollowKrunga } }
                ),
                User.updateOne(
                    { _id: jiskoFollowKrunga },
                    { $pull: { followers: followKrneWala } }
                ),
            ]);
            return res.status(200).json({
                message: 'Unfollowed successfully',
                success: true
            });
        } else {
            // Follow logic
            await Promise.all([
                User.updateOne(
                    { _id: followKrneWala },
                    { $push: { following: jiskoFollowKrunga } }
                ),
                User.updateOne(
                    { _id: jiskoFollowKrunga },
                    { $push: { followers: followKrneWala } }
                ),
            ]);
            return res.status(200).json({
                message: 'Followed successfully',
                success: true
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const currentUserId = req.id;

        if (!query || query.trim() === '') {
            return res.status(200).json({
                success: true,
                users: []
            });
        }

        // Search users by username (case-insensitive)
        const users = await User.find({
            username: { $regex: query, $options: 'i' },
            _id: { $ne: currentUserId } // Exclude current user
        })
            .select('username profilePicture bio')
            .limit(20);

        return res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to search users",
            success: false
        });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Hash and set to resetPasswordToken
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set token expire time
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // Create reset url
        // const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/user/password/reset/${resetToken}`;
        // Since we are separating frontend and backend, we might want to send the frontend URL
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const message = `Your password reset token is :- \n\n ${resetUrl} \n\nIf you have not requested this email then, please ignore it.`;

        // Log the link for debugging since I can't access user's email
        console.log("Reset Password Link:", resetUrl);

        try {
            await sendEmail({
                email: user.email,
                subject: `Password Recovery`,
                message,
            });

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} successfully`,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                message: error.message,
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Reset Password Token is invalid or has been expired",
                success: false,
            });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                message: "Password does not match",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};