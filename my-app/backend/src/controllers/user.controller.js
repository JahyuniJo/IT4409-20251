// // backend/src/controllers/user.controller.js
// import { User } from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";
// import { Post } from "../models/post.model.js";

// export const register = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         if (!username || !email || !password) {
//             return res.status(401).json({
//                 message: "Something is missing, please check!",
//                 success: false,
//             });
//         }

//         const user = await User.findOne({ email });
//         if (user) {
//             return res.status(401).json({
//                 message: "Try different email",
//                 success: false,
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         await User.create({
//             username,
//             email,
//             password: hashedPassword
//         });

//         return res.status(201).json({
//             message: "Account created successfully.",
//             success: true,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// }

// export const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(401).json({
//                 message: "Something is missing, please check!",
//                 success: false,
//             });
//         }

//         let user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({
//                 message: "Incorrect email or password",
//                 success: false,
//             });
//         }

//         const isPasswordMatch = await bcrypt.compare(password, user.password);
//         if (!isPasswordMatch) {
//             return res.status(401).json({
//                 message: "Incorrect email or password",
//                 success: false,
//             });
//         }

//         const token = await jwt.sign(
//             { userId: user._id }, 
//             process.env.SECRET_KEY, 
//             { expiresIn: '1d' }
//         );

//         // Populate each post in the posts array
//         const populatedPosts = await Promise.all(
//             user.posts.map(async (postId) => {
//                 const post = await Post.findById(postId);
//                 if (post && post.author.equals(user._id)) {
//                     return post;
//                 }
//                 return null;
//             })
//         );

//         user = {
//             _id: user._id,
//             username: user.username,
//             email: user.email,
//             profilePicture: user.profilePicture,
//             bio: user.bio,
//             gender: user.gender,
//             followers: user.followers,
//             following: user.following,
//             posts: populatedPosts.filter(post => post !== null)
//         }

//         return res
//             .cookie('token', token, { 
//                 httpOnly: true, 
//                 sameSite: 'strict', 
//                 maxAge: 1 * 24 * 60 * 60 * 1000 
//             })
//             .json({
//                 message: `Welcome back ${user.username}`,
//                 success: true,
//                 user
//             });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

// export const logout = async (_, res) => {
//     try {
//         return res.cookie("token", "", { maxAge: 0 }).json({
//             message: 'Logged out successfully.',
//             success: true
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

// export const getProfile = async (req, res) => {
//     try {
//         const userId = req.params.id;

//         let user = await User.findById(userId)
//             .populate({ path: 'posts', options: { sort: { createdAt: -1 } } })
//             .populate('bookmarks');

//         if (!user) {
//             return res.status(404).json({
//                 message: 'User not found',
//                 success: false
//             });
//         }

//         return res.status(200).json({
//             user,
//             success: true
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

// export const editProfile = async (req, res) => {
//     try {
//         const userId = userId;
//         const { bio, gender } = req.body;
//         const profilePicture = req.file;
//         let cloudResponse;

//         if (profilePicture) {
//             const fileUri = getDataUri(profilePicture);
//             cloudResponse = await cloudinary.uploader.upload(fileUri);
//         }

//         const user = await User.findById(userId).select('-password');
//         if (!user) {
//             return res.status(404).json({
//                 message: 'User not found.',
//                 success: false
//             });
//         }

//         if (bio) user.bio = bio;
//         if (gender) user.gender = gender;
//         if (profilePicture) user.profilePicture = cloudResponse.secure_url;

//         await user.save();

//         return res.status(200).json({
//             message: 'Profile updated.',
//             success: true,
//             user
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

// export const getSuggestedUsers = async (req, res) => {
//     try {
//         // 1. Fetch the current user to get their 'following' list
//         // We select only the 'following' field for performance
//         const currentUser = await User.findById(req.id).select('following');

//         // Safety check if user doesn't exist
//         if (!currentUser) {
//             return res.status(404).json({ 
//                 message: "User not found", 
//                 success: false 
//             });
//         }

//         // 2. Find users who are NOT the current user AND NOT in the following list
//         const suggestedUsers = await User.find({ 
//             _id: { 
//                 $nin: [...currentUser.following, req.id] 
//             } 
//         })
//         .select("-password")
//         .limit(10);

//         if (!suggestedUsers || suggestedUsers.length === 0) {
//             return res.status(200).json({
//                 message: 'Currently do not have any users',
//                 success: true,
//                 users: []
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             users: suggestedUsers
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// };

// export const followOrUnfollow = async (req, res) => {
//     try {
//         const followKrneWala = req.id; // Current user
//         const jiskoFollowKrunga = req.params.id; // Target user

//         if (followKrneWala === jiskoFollowKrunga) {
//             return res.status(400).json({
//                 message: 'You cannot follow/unfollow yourself',
//                 success: false
//             });
//         }

//         const user = await User.findById(followKrneWala);
//         const targetUser = await User.findById(jiskoFollowKrunga);

//         if (!user || !targetUser) {
//             return res.status(400).json({
//                 message: 'User not found',
//                 success: false
//             });
//         }

//         // Check if already following
//         const isFollowing = user.following.includes(jiskoFollowKrunga);

//         if (isFollowing) {
//             // Unfollow logic
//             await Promise.all([
//                 User.updateOne(
//                     { _id: followKrneWala }, 
//                     { $pull: { following: jiskoFollowKrunga } }
//                 ),
//                 User.updateOne(
//                     { _id: jiskoFollowKrunga }, 
//                     { $pull: { followers: followKrneWala } }
//                 ),
//             ]);
//             return res.status(200).json({ 
//                 message: 'Unfollowed successfully', 
//                 success: true 
//             });
//         } else {
//             // Follow logic
//             await Promise.all([
//                 User.updateOne(
//                     { _id: followKrneWala }, 
//                     { $push: { following: jiskoFollowKrunga } }
//                 ),
//                 User.updateOne(
//                     { _id: jiskoFollowKrunga }, 
//                     { $push: { followers: followKrneWala } }
//                 ),
//             ]);
//             return res.status(200).json({ 
//                 message: 'Followed successfully', 
//                 success: true 
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false
//         });
//     }
// }

// backend/src/controllers/user.controller.js
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin"
            });
        }

        // 🔎 Check cả email & username
        const existedUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existedUser) {
            return res.status(409).json({
                success: false,
                message:
                    existedUser.email === email
                        ? "Email đã được sử dụng"
                        : "Username đã tồn tại"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "Đăng ký thành công"
        });

    } catch (error) {
        console.error(error);

        // 🔥 BẮT DUPLICATE KEY TỪ MONGO (CHỐT CHẶN CUỐI)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];

            return res.status(409).json({
                success: false,
                message:
                    field === "email"
                        ? "Email đã tồn tại"
                        : "Username đã tồn tại"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


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
            bookmarks: user.bookmarks,
            posts: populatedPosts.filter(post => post !== null)
        }

        return res
            .cookie('token', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
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
                options: { sort: { createdAt: -1 } }
            })
            .populate('bookmarks')
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
        const userId = req.userId;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        // Validate gender
        const allowedGenders = ["male", "female", "custom"];
        if (gender && !allowedGenders.includes(gender)) {
            return res.status(400).json({
                message: "Invalid gender value",
                success: false
            });
        }

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        if (bio !== undefined) user.bio = bio;
        if (gender !== undefined) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: "Profile updated.",
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const currentUser = await User.findById(userId).select('following');

        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const suggestedUsers = await User.find({
            _id: {
                $nin: [...currentUser.following, userId]
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

export const getSearchedUsers = async (req, res) => {
    try {
        const currentUserId = req.userId;

        const keyword = req.query.q?.trim();

        // 1. Không có keyword → trả mảng rỗng
        if (!keyword) {
            return res.status(200).json({
                success: true,
                users: []
            });
        }

        // 2. Regex tìm kiếm (không phân biệt hoa thường)
        const searchRegex = new RegExp(keyword, "i");

        // 3. Query
        const users = await User.find({
            _id: { $ne: currentUserId }, // ⬅️ loại chính mình
            $or: [
                { username: searchRegex },
                { fullname: searchRegex }
            ]
        })
            .select("_id username fullname profilePicture")
            .limit(10);

        return res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        console.error("Search error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.userId;
        const jiskoFollowKrunga = req.params.id; //

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