import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../Home.css";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [signupMethod, setSignupMethod] = useState("");
  const navigate = useNavigate();

  // Check if token exists and extract user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");
    const storedProfileImage = localStorage.getItem("profileImage");
    const storedSignupMethod = localStorage.getItem("signupMethod");

    if (token && storedName) {
      setUserName(storedName);
      setProfileImage(storedProfileImage || "");
      setSignupMethod(storedSignupMethod || "email");
    } else {
      setUserName("");
      setProfileImage("");
      setSignupMethod("");
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("signupMethod");
    localStorage.removeItem("isSuperuser");
    setUserName("");
    setProfileImage("");
    setSignupMethod("");
    navigate("/login");
  };

  // Render avatar based on signup method
  const renderAvatar = () => {
    if (!userName) {
      return (
        <Link to="/login" className="avatar-icon" title="Login">
          👤
        </Link>
      );
    }

    if (signupMethod === "google" && profileImage) {
      return (
        <div className="avatar-container" onClick={() => navigate("/dashboard")} title="Go to Profile">
          <img 
            src={profileImage} 
            alt="Profile" 
            className="avatar-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="avatar-fallback" style={{ display: 'none' }}>
            👤
          </div>
        </div>
      );
    }

    return (
      <div className="avatar-icon" onClick={() => navigate("/dashboard")} title="Go to Profile">
        👤
      </div>
    );
  };

  return (
    <div className="home-container">
      <h1>Welcome to Technians Softech</h1>

      {/* Avatar in top right */}
      {renderAvatar()}

      {/* Display user name if logged in */}
      {userName ? <h3>Hey, {userName}!</h3> : <h2>Welcome, Guest!</h2>}

      {/* Home buttons */}
      <div className="home-buttons">
        {userName ? (
          // Show these buttons if user is logged in
          <>
            <Link to="/dashboard">
              <button>Dashboard</button>
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          // Show Sign Up and Log In buttons if user is not logged in
          <>
            <Link to="/signup">
              <button>Sign Up</button>
            </Link>
            <Link to="/login">
              <button>Log In</button>
            </Link>
          </>
        )}
      </div>

      {/* About This Project Section */}
      <div className="about-project-section">
        {/* Project Description Scroller */}
        <div className="project-description-container">
          <div className="scroller">
            <div className="scroller-content">
              <div className="description-card about-project-card">
                <h2 className="about-project-heading">About This Project</h2>
              </div>
              <div className="description-card">
                <h3>🚀 Modern Authentication System</h3>
                <p>A comprehensive user authentication platform built with React and Node.js, featuring secure login methods and user management.</p>
              </div>
              <div className="description-card">
                <h3>🔐 Multiple Login Options</h3>
                <p>Support for both email/password authentication with OTP verification and seamless Google OAuth integration for enhanced user experience.</p>
              </div>
              <div className="description-card">
                <h3>👤 User Profile Management</h3>
                <p>Complete user profile system with customizable fields, profile images, and real-time updates with a modern, responsive interface.</p>
              </div>
              <div className="description-card">
                <h3>🎨 Theme Customization</h3>
                <p>Light and dark theme support with persistent preferences, providing users with a personalized viewing experience.</p>
              </div>
              <div className="description-card">
                <h3>👑 Superuser Dashboard</h3>
                <p>Advanced user management interface for administrators with comprehensive user analytics and system overview.</p>
              </div>
              <div className="description-card">
                <h3>📱 Responsive Design</h3>
                <p>Mobile-first responsive design ensuring optimal user experience across all devices and screen sizes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="social-links">
          <span className="developed-by">Developed by:</span>
          <a href="https://www.linkedin.com/in/scriptforprince/" target="_blank" rel="noopener noreferrer" className="social-link">
            <div className="social-icon linkedin">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
          </a>
          <a href="https://github.com/scriptforprince7" target="_blank" rel="noopener noreferrer" className="social-link">
            <div className="social-icon github">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
