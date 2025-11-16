const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecretkey"; // Nên để vào file .env

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Kiểm tra tồn tại
      const exists = await pool.query(
        "SELECT * FROM users WHERE email = $1 OR username = $2",
        [email, username]
      );

      if (exists.rows.length > 0) {
        return res.status(400).json({ message: "Email hoặc username đã tồn tại" });
      }

      // Hash password
      const hash = await bcrypt.hash(password, 10);

      // Lưu user
      const newUser = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING *",
        [username, email, hash]
      );

      res.json({ message: "Đăng ký thành công", user: newUser.rows[0] });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Email không tồn tại" });
      }

      const user = result.rows[0];

      // Kiểm tra mật khẩu
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Sai mật khẩu" });
      }

      // Tạo token
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.json({ 
        message: "Đăng nhập thành công",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar
        }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  me: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) return res.status(401).json({ message: "Không có token" });

      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await pool.query("SELECT id, username, email, avatar FROM users WHERE id = $1", [
        decoded.id,
      ]);

      res.json(user.rows[0]);

    } catch (err) {
      res.status(401).json({ message: "Token không hợp lệ" });
    }
  }
};
