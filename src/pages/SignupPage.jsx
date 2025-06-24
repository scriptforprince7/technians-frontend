import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';
import "../Auth.css";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!otpStep) {
      setLoading(true);
      try {
        await axios.post("https://technians-backend.onrender.com/api/auth/signup-otp", { name, email, password });
        toast.success("OTP sent to your email. Please enter it below.");
        setOtpStep(true);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Signup failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Step 2: Verify OTP
      setLoading(true);
      try {
        await axios.post("https://technians-backend.onrender.com/api/auth/verify-otp", { name, email, password, otp });
        toast.success("Signup successful! Please log in.");
        navigate("/login");
      } catch (error) {
        toast.error(error?.response?.data?.message || "OTP verification failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Google Sign Up Handlers
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("https://technians-backend.onrender.com/api/auth/google", {
        token: credentialResponse.credential,
      });
      // Store token, name, profile image, signup method, and superuser status in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("profileImage", res.data.profileImage || "");
      localStorage.setItem("signupMethod", res.data.signupMethod || "google");
      localStorage.setItem("isSuperuser", res.data.isSuperuser ? "true" : "false");
      toast.success("Signed up with Google!");
      navigate("/");
    } catch (error) {
      toast.error("Google sign up failed");
    }
  };

  const handleGoogleFailure = () => {
    toast.error("Google sign in failed");
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
      <form onSubmit={handleSignup} className="auth-form">
        <h2>Signup</h2>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={otpStep}
          />
        </div>
        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={otpStep}
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
            className="auth-input"
            disabled={otpStep}
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#4caf50',
              fontSize: 20,
              userSelect: 'none',
            }}
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
        {otpStep && (
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
            />
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? (otpStep ? "Verifying..." : "Sending OTP...") : (otpStep ? "Verify OTP" : "Sign Up")}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0 10px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#eee' }} />
          <span style={{ margin: '0 12px', color: '#888', fontSize: '0.95rem' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#eee' }} />
        </div>
        <div style={{ width: '100%', marginBottom: 10 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            width="100%"
            text="signup_with"
            shape="rectangular"
          />
        </div>
        <span style={{ marginTop: '10px', textAlign: 'center', display: 'block', color: '#555' }}>
          Have account?{' '}
          <a href="/login" style={{ color: '#4caf50', textDecoration: 'none', fontWeight: 500 }}>Login</a>
        </span>
      </form>
    </div>
  );
};

export default SignupPage;
