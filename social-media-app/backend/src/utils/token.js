// import thư viện
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// KHóa bí mật
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_EXPIRES = "15m";   // Thời gian heet hạn của access token
const REFRESH_EXPIRES_DAYS = 30; // Thời gian hết hạn của refresh token 30 ngày
// Hàm tạo access token sử dụng tài nguyên được bảo mật
function generateAccessToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
}
// Hàm tạo refresh token sử dụng để lấy Access Token mới khi Access Token cũ hết hạn tránh phải đăng nhập lại
function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex"); 
}
//Tạo ra 64 byte dữ liệu ngẫu nhiên an toàn về mật mã and chuyển nó thành chuỗi hexadecima dễ lưu trữ

//Xuất dữ liệu các hàm và hằng số
module.exports = {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_EXPIRES_DAYS
};
