import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "../UserInfo.css";

const UserInfo = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Access denied. Superuser privileges required.");
        } else {
          setError("Failed to load users");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, username) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete user "${username}"? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete!',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/auth/user/data/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove user from state
        setUsers(users.filter(user => user.user_id !== userId));

        // Show success message
        Swal.fire(
          'Deleted!',
          `User "${username}" has been deleted successfully.`,
          'success'
        );

        toast.success(`User "${username}" deleted successfully`);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      
      let errorMessage = "Failed to delete user";
      if (err.response?.status === 403) {
        errorMessage = "Access denied. You can only delete your own data or must be a superuser.";
      } else if (err.response?.status === 404) {
        errorMessage = "User not found";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      Swal.fire(
        'Error!',
        errorMessage,
        'error'
      );

      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="user-info-loading">Loading users...</div>;
  if (error) return <div className="user-info-error">{error}</div>;

  return (
    <div className="user-info-container">
      <h2 className="user-info-title">User Information</h2>
      <div className="user-info-stats">
        <div className="stat-card">
          <span className="stat-number">{users.length}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{users.filter(user => user.signup_method === 'google').length}</span>
          <span className="stat-label">Google Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{users.filter(user => user.signup_method === 'email').length}</span>
          <span className="stat-label">Email Users</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{users.filter(user => user.is_superuser).length}</span>
          <span className="stat-label">Superusers</span>
        </div>
      </div>
      
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Login Type</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id} className={user.is_superuser ? 'superuser-row' : ''}>
                <td>{user.user_id}</td>
                <td>
                  <div className="user-info-cell">
                    <span className="username">{user.username}</span>
                    {user.is_superuser && <span className="superuser-badge">👑</span>}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`login-type ${user.signup_method}`}>
                    {user.signup_method === 'google' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                          alt="Google"
                          style={{ width: '16px', height: '16px' }}
                        />
                        Google
                      </div>
                    ) : (
                      '📧 Email'
                    )}
                  </span>
                </td>
                <td>
                  <span className={`role-badge ${user.is_superuser ? 'superuser' : 'user'}`}>
                    {user.is_superuser ? 'Superuser' : 'User'}
                  </span>
                </td>
                <td>{formatDate(user.created_at)}</td>
                <td>
                  <button
                    className="delete-user-btn"
                    onClick={() => handleDeleteUser(user.user_id, user.username)}
                    title={`Delete ${user.username}`}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserInfo; 