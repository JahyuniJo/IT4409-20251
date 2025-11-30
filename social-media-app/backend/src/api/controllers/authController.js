// src/controllers/authController.js
const bcrypt = require("bcrypt");
const db = require("../../config/db");
const {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_EXPIRES_DAYS
} = require("../../utils/token");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await db.query(
      "SELECT * FROM users WHERE email=$1 OR username=$2",
      [email, username]
    );
    if (exists.rows.length > 0)
      return res.status(400).json({ message: "Email hoặc username đã tồn tại!" });

    const hash = await bcrypt.hash(password, 12);

    const user = await db.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING iduser, username, email, avatar, created_at`,
      [username, email, hash]
    );

    res.json({
      message: "Đăng ký thành công",
      user: user.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { rows } = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = rows[0];

    if (!user) return res.status(400).json({ message: "Sai email hoặc mật khẩu!" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Sai email hoặc mật khẩu!" });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken();

    const refreshHash = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

    await db.query(
      `INSERT INTO sessions (user_id, refresh_token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshHash, expiresAt]
    );

    res.json({
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      user: {
        iduser: user.iduser,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
