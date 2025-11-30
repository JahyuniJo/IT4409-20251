const pool = require("../../config/db"); // PostgreSQL pool

// ==== Profile CRUD ====
const getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT iduser, username, email, avatar, bio FROM users WHERE iduser = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { username, bio, avatar } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET username=$1, bio=$2, avatar=$3 WHERE iduser=$4 RETURNING iduser, username, email, bio, avatar",
      [username, bio, avatar, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProfile = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE iduser=$1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==== Follow / Unfollow ====
const followUser = async (req, res) => {
  const followerId = req.user.iduser; // từ JWT
  const { id } = req.params; // user cần follow
  try {
    await pool.query(
      "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [followerId, id]
    );
    res.json({ message: "Followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const unfollowUser = async (req, res) => {
  const followerId = req.user.iduser;
  const { id } = req.params;
  try {
    await pool.query(
      "DELETE FROM follows WHERE follower_id=$1 AND following_id=$2",
      [followerId, id]
    );
    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==== Suggestions (người dùng gợi ý) ====
const getSuggestions = async (req, res) => {
  const userId = req.user.iduser;
  try {
    const result = await pool.query(
      `SELECT iduser, username, avatar
       FROM users
       WHERE iduser != $1
       AND iduser NOT IN (SELECT following_id FROM follows WHERE follower_id = $1)
       LIMIT 5`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  followUser,
  unfollowUser,
  getSuggestions,
};
