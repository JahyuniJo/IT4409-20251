import express from "express";
import { 
    editProfile, 
    followOrUnfollow, 
    getProfile, 
    getSuggestedUsers, 
    getSearchedUsers,
    login, 
    logout, 
    register,
    forgotPassword,
    resetPassword
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);

router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);
router.route('/search').get(isAuthenticated, getSearchedUsers);

router.route('/profile/edit').put(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/:id/profile').get(isAuthenticated, getProfile);


router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password-otp').post(resetPassword);
export default router;
