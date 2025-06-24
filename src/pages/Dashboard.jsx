import React, { useState, useEffect } from "react";
import { Link, useLocation, Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import UserInfo from "./UserInfo";
import "../Dashboard.css"; // For sidebar styling

const ThemeSettings = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme === "dark" ? "dark-theme" : "";
  };
  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2 style={{ color: '#6c63ff', marginBottom: 24 }}>Theme Settings</h2>
      <label style={{ fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <span role="img" aria-label="theme">🌗</span>
        <span style={{ fontWeight: 600 }}>{theme === "dark" ? "Dark" : "Light"} Mode</span>
        <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} style={{ width: 32, height: 18 }} />
      </label>
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "";
    // Check if user is superuser
    const superuserStatus = localStorage.getItem("isSuperuser");
    setIsSuperuser(superuserStatus === "true");
  }, [theme]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          {/* Home tab */}
          <li>
            <Link to="/">🏠 Home</Link>
          </li>
          {/* Profile tab (default) */}
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard">👤 Profile</Link>
          </li>
          {/* User Info tab (superuser only) */}
          {isSuperuser && (
            <li className={location.pathname === "/dashboard/user-info" ? "active" : ""}>
              <Link to="/dashboard/user-info">👥 User Info</Link>
            </li>
          )}
          {/* Theme Settings tab */}
          <li className={location.pathname === "/dashboard/theme-settings" ? "active" : ""}>
            <Link to="/dashboard/theme-settings">🎨 Theme Settings</Link>
          </li>
        </ul>
      </div>

      {/* Content Outlet */}
      <div className="dashboard-content">
        <Routes>
          <Route index element={<Profile />} /> {/* Default for /dashboard */}
          {isSuperuser && <Route path="user-info" element={<UserInfo />} />}
          <Route path="theme-settings" element={<ThemeSettings theme={theme} setTheme={setTheme} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
