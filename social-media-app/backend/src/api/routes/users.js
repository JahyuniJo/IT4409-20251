const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/authMiddleware");
const {
  getProfile,
  updateProfile,
  deleteProfile,
  followUser,
  unfollowUser,
  getSuggestions,
} = require("../controllers/usersController");

// ==== Profile CRUD ====
router.get("/:id", auth, getProfile);        // Lấy thông tin user
router.put("/:id", auth, updateProfile);     // Cập nhật thông tin user
router.delete("/:id", auth, deleteProfile);  // Xóa tài khoản

// ==== Follow / Unfollow ====
router.post("/follow/:id", auth, followUser);
router.post("/unfollow/:id", auth, unfollowUser);

// ==== Suggestions ====
router.get("/suggestions", auth, getSuggestions);

module.exports = router;
