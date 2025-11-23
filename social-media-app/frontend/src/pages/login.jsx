import { useState } from "react";
import { API_URL } from "../api";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      localStorage.setItem("token", data.token); // Lưu token
      alert("Đăng nhập thành công");
    }
  };

  return (
    <div style={{ width: 300, margin: "50px auto" }}>
      <h2>Đăng nhập</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Đăng nhập</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
