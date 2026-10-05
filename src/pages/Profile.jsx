import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user:", error);

        localStorage.removeItem("user");

        navigate("/login", { replace: true });
        return;
      }
    } else {
      console.error("No user found in localStorage");

      navigate("/login", { replace: true });
      return;
    }

    setLoading(false);
  }, [navigate]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  // =====================================================
  // NO USER
  // =====================================================

  if (!user) {
    return null;
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");

    window.dispatchEvent(
      new Event("authChange")
    );

    navigate("/", {
      replace: true
    });
  };

  // =====================================================
  // PROFILE PHOTO
  // =====================================================

  const profilePhoto =
    user.photo ||
    user.profilePhoto ||
    user.avatar ||
    user.image ||
    null;

  // =====================================================
  // PROFILE INITIAL
  // =====================================================

  const getInitial = () => {
    const name =
      user.name ||
      user.email ||
      "U";

    return name
      .charAt(0)
      .toUpperCase();
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>My Profile</h1>

        {/* =================================================
            PROFILE PHOTO
        ================================================= */}

        <div className="profile-photo">

          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="profile-avatar">
              {getInitial()}
            </div>
          )}

        </div>

        {/* =================================================
            NAME
        ================================================= */}

        <div className="profile-field">

          <label>Name</label>

          <p>
            {user.name || "Not available"}
          </p>

        </div>

        {/* =================================================
            EMAIL
        ================================================= */}

        <div className="profile-field">

          <label>Email</label>

          <p>
            {user.email || "Not available"}
          </p>

        </div>

        {/* =================================================
            PHONE
        ================================================= */}

        <div className="profile-field">

          <label>Phone</label>

          <p>
            {user.phone || "Not available"}
          </p>

        </div>

        {/* =================================================
            USER ID
        ================================================= */}

        <div className="profile-field">

          <label>User ID</label>

          <p>
            {user._id ||
              user.id ||
              "Not available"}
          </p>

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="profile-actions">

          {/* EDIT PROFILE */}

          <button
            className="edit-profile-btn"
            onClick={() => navigate("/edit-profile")}
          >
            ✏️ Edit Profile
          </button>

          {/* HOME */}

          <button
            className="home-profile-btn"
            onClick={() => navigate("/")}
          >
            🏠 Home
          </button>

          {/* MY ORDERS */}

          <button
            className="orders-profile-btn"
            onClick={() => navigate("/myorders")}
          >
            📦 My Orders
          </button>

          {/* LOGOUT */}

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;