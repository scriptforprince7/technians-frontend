import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Auth.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://technians-backend.onrender.com/api/auth/login", {
        email,
        password,
      });

      const { token, name, profileImage, signupMethod, isSuperuser } = response.data;

      // Store token, name, profile image, signup method, and superuser status in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("profileImage", profileImage || "");
      localStorage.setItem("signupMethod", signupMethod || "email");
      localStorage.setItem("isSuperuser", isSuperuser ? "true" : "false");

      toast.success(`Welcome back, ${name}!`);
      navigate("/"); // Redirect to Home page
    } catch (error) {
      console.error("Login Failed", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Invalid credentials. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => navigate("/")}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'none',
          border: 'none',
          color: '#4caf50',
          fontSize: 20,
          cursor: 'pointer',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
        aria-label="Go back to home"
      >
        <svg width="24" height="24" fill="none" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        Go Back
      </button>
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login</h2>
        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={0}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg height="22" width="22" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5.05 0-9.29-3.14-11-8 1.21-3.06 3.6-5.5 6.58-6.71"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.93 0 3.5-1.57 3.5-3.5 0-.47-.09-.92-.26-1.33"/></svg>
            ) : (
              <svg height="22" width="22" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12S5 5 12 5s11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3.5"/></svg>
            )}
          </span>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
