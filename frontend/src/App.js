import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./styles.css";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [email, setEmail] = useState(
    localStorage.getItem("email") || null
  );

  // 🔹 LOGIN HANDLER
  const handleLogin = (jwtToken, userEmail) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("email", userEmail);

    setToken(jwtToken);
    setEmail(userEmail);
  };

  // 🔹 LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");

    setToken(null);
    setEmail(null);
  };

  return (
    <>
      {token ? (
        <Dashboard
          token={token}
          email={email}     // ✅ used for admin check
          onLogout={handleLogout}
        />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
