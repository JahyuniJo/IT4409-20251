// backend/src/controllers/post.controller.js
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.userId;

        if (!image) {
            return res.status(400).json({
                message: 'Image required',
                success: false
            });
        }

        // Image upload and optimization
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // Buffer to data URI
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to create post',
            success: false
        });
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to fetch posts',
            success: false
        });
    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.userId;

        const posts = await Post.find({ author: authorId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'username profilePicture'
            })
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to fetch user posts',
            success: false
        });
    }
}

export const likePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.userId;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        // Like logic
        await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
        await post.save();

        // Implement socket.io for real-time notification
        const user = await User.findById(likeKrneWalaUserKiId)
            .select('username profilePicture');

        const postOwnerId = post.author.toString();
        if (postOwnerId !== likeKrneWalaUserKiId) {
            // Emit a notification event
            const notification = {
                type: 'like',
                userId: likeKrneWalaUserKiId,
                userDetails: user,
                postId,
                message: 'Your post was liked'
            };
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            if (postOwnerSocketId) {
                io.to(postOwnerSocketId).emit('notification', notification);
            }
        }

        return res.status(200).json({
            message: 'Post liked',
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to like post',
            success: false
        });
    }
}

export const dislikePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.userId;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        // Dislike logic
        await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
        await post.save();

        // Implement socket.io for real-time notification
        const user = await User.findById(likeKrneWalaUserKiId)
            .select('username profilePicture');

        const postOwnerId = post.author.toString();
        if (postOwnerId !== likeKrneWalaUserKiId) {
            // Emit a notification event
            const notification = {
                type: 'dislike',
                userId: likeKrneWalaUserKiId,
                userDetails: user,
                postId,
                message: 'Post was unliked'
            };
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            if (postOwnerSocketId) {
                io.to(postOwnerSocketId).emit('notification', notification);
            }
        }

        return res.status(200).json({
            message: 'Post disliked',
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to dislike post',
            success: false
        });
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;
        const { text, parentId = null } = req.body;

        if (!text) {
            return res.status(400).json({
                message: 'Text is required',
                success: false
            });
        }

        const comment = await Comment.create({
            text,
            author: userId,
            post: postId,
            parentId
        });

        await comment.populate({
            path: 'author',
            select: 'username profilePicture'
        });

        await Post.findByIdAndUpdate(postId, {
            $push: { comments: comment._id }
        });

        res.status(201).json({
            success: true,
            comment
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to add comment',
            success: false
        });
    }
};



export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId })
            .populate('author', 'username profilePicture')
            .sort({ createdAt: -1 });

        if (!comments || comments.length === 0) {
            return res.status(200).json({
                message: 'No comments found for this post',
                success: true,
                comments: []
            });
        }

        return res.status(200).json({
            success: true,
            comments
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to fetch comments',
            success: false
        });
    }
}


export const editComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        if (comment.author.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        comment.text = text;
        await comment.save();
        await comment.populate({
            path: "author",
            select: "username profilePicture"
        });
        res.status(200).json({
            success: true,
            comment,
            message: "Comment updated",
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false });
        }

        if (comment.author.toString() !== req.userId) {
            return res.status(403).json({ success: false });
        }

        // xóa comment con
        await Comment.deleteMany({ parentId: id });

        // xóa chính nó
        await Comment.findByIdAndDelete(id);

        // pull khỏi post
        await Post.updateOne(
            { _id: comment.post },
            { $pull: { comments: id } }
        );

        res.status(200).json({ success: true, commentId: id });
    } catch (err) {
        res.status(500).json({ success: false });
    }
};


export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        // Check if the logged-in user is the owner of the post
        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: 'Unauthorized',
                success: false
            });
        }

        // Delete post
        await Post.findByIdAndDelete(postId);

        // Remove the post id from the user's posts
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // Delete associated comments
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: 'Post deleted'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to delete post',
            success: false
        });
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false
            });
        }

        const user = await User.findById(userId);

        const isBookmarked = user.bookmarks.some(
            id => id.toString() === postId
        );

        if (isBookmarked) {
            user.bookmarks.pull(postId);
            await user.save();

            return res.status(200).json({
                success: true,
                message: 'Unsaved',
                bookmarks: user.bookmarks
            });
        }

        user.bookmarks.push(postId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Saved',
            bookmarks: user.bookmarks
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Failed to bookmark post',
            success: false
        });
    }
};
