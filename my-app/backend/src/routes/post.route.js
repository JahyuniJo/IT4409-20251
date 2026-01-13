import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
<<<<<<< HEAD
import { 
    addComment, 
    addNewPost, 
    bookmarkPost, 
    deletePost, 
    dislikePost, 
    getAllPost, 
    getCommentsOfPost, 
    getUserPost, 
    likePost,
    editComment,
    deleteComment
=======
import {
    addComment,
    addNewPost,
    bookmarkPost,
    deletePost,
    dislikePost,
    getAllPost,
    getCommentsOfPost,
    getUserPost,
    likePost,
    repost
>>>>>>> ea4ed2a9326ecfed096a4b2ccc21f169d17da622
} from "../controllers/post.controller.js";

const router = express.Router();

router.route("/addpost").post(isAuthenticated, upload.single('image'), addNewPost);
router.route("/all").get(isAuthenticated, getAllPost);
router.route("/userpost/all").get(isAuthenticated, getUserPost);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all").get(isAuthenticated, getCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);
<<<<<<< HEAD
router.put("/:id", isAuthenticated, editComment);
router.delete("/:id", isAuthenticated, deleteComment);
=======
router.route("/:id/repost").post(isAuthenticated, repost);

>>>>>>> ea4ed2a9326ecfed096a4b2ccc21f169d17da622
export default router;