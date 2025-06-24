import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editFields, setEditFields] = useState({ about_me: "", contact_number: "", company_name: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setEditFields({
          about_me: res.data.about_me || "",
          contact_number: res.data.contact_number || "",
          company_name: res.data.company_name || "",
        });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setEditFields({ ...editFields, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/auth/profile", editFields, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile({ ...profile, ...editFields });
      toast.success("Profile updated successfully!");
      setSaving(false);
    } catch (err) {
      setError("Failed to save profile");
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!profile) return null;

  return (
    <div className="profile-container">
      <div className="profile-background" />
      <h2 className="profile-title">My Profile</h2>
      
      {/* Profile Image */}
      <div className="profile-image-container">
        {profile.profile_image ? (
          <img 
            src={profile.profile_image} 
            alt="Profile" 
            className="profile-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        <div className="profile-image-fallback" style={{ display: profile.profile_image ? 'none' : 'block' }}>
          👤
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-field">
          <span className="profile-icon">👤</span>
          <span className="profile-text">@{profile.username}</span>
        </div>
        <div className="profile-field">
          <span className="profile-icon">📧</span>
          <span>{profile.email}</span>
        </div>
        <div className="profile-field">
          <span className="profile-icon">🔑</span>
          <span style={{ textTransform: 'capitalize' }}>{profile.signup_method} login</span>
        </div>
        <div className="profile-field">
          <span className="profile-icon">⏰</span>
          <span>{profile.last_login ? new Date(profile.last_login).toLocaleString() : '-'}</span>
        </div>
        <div className="profile-input-field">
          <span className="profile-icon" style={{ fontSize: 22 }}>📝</span>
          <input
            type="text"
            name="about_me"
            value={editFields.about_me}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            className="profile-input"
          />
        </div>
        <div className="profile-input-field">
          <span className="profile-icon" style={{ fontSize: 22 }}>📱</span>
          <input
            type="text"
            name="contact_number"
            value={editFields.contact_number}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="profile-input"
          />
        </div>
        <div className="profile-input-field">
          <span className="profile-icon" style={{ fontSize: 22 }}>🏢</span>
          <input
            type="text"
            name="company_name"
            value={editFields.company_name}
            onChange={handleChange}
            placeholder="Enter your company name"
            className="profile-input"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="profile-save-btn"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default Profile; 