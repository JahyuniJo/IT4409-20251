import React, { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        console.log(data);
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "white",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#1e1e1e",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 0 10px rgba(255,255,255,0.1)",
          width: "320px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Sign Up
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          Sign Up
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem", color: "#bbb" }}>
          Already have an account? <a href="/login" style={{ color: "#09f" }}>Login</a>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "1px solid #333",
  backgroundColor: "#2a2a2a",
  color: "white",
  fontSize: "1rem",
};

const buttonStyle = {
  width: "100%",
  padding: "0.75rem",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#0095f6",
  color: "white",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
};

export default Register;
