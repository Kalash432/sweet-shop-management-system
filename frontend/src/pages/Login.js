import { useState } from "react";
import "../Login.css";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      if (isRegister) {
        alert("✅ Registration successful! Please login.");
        setIsRegister(false);
      } else {
        // 🔥 ADMIN CHOICE
        const adminChoice = window.confirm(
          "Do you want to login as Admin?"
        );

        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        localStorage.setItem(
          "isAdmin",
          adminChoice ? "true" : "false"
        );

        onLogin(data.token, email);
      }

      setEmail("");
      setPassword("");
    } catch (err) {
      alert("❌ Server error");
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>🍬 Sweet Shop</h2>
        <p className="subtitle">Delight in every bite</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {isRegister ? "Register" : "Login"}
        </button>

        <p className="register-text">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsRegister(false)}>Login</span>
            </>
          ) : (
            <>
              New here?{" "}
              <span onClick={() => setIsRegister(true)}>Register</span>
            </>
          )}
        </p>
      </form>
    </div>
  );
}

export default Login;
