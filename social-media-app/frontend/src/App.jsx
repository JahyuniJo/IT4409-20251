import { useState } from "react";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  const [page, setPage] = useState("login");

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={() => setPage("login")}>Đăng nhập</button>
      <button onClick={() => setPage("register")}>Đăng ký</button>

      {page === "login" ? <Login /> : <Register />}
    </div>
  );
}
useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => console.log("User info:", data));
  }
}, []);

export default App;
