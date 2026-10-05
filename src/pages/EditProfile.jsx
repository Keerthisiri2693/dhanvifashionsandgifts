import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();

  // =====================================================
  // LOAD USER
  // =====================================================

  const savedUser = localStorage.getItem("user");

  let user = {};

  try {
    user = savedUser
      ? JSON.parse(savedUser)
      : {};
  } catch (error) {
    console.error("Invalid user data:", error);
    user = {};
  }

  // =====================================================
  // STATE
  // =====================================================

  const [name, setName] = useState(
    user.name || ""
  );

  const [phone, setPhone] = useState(
    user.phone || ""
  );

  const [profileImage, setProfileImage] = useState(
    user.photo ||
    user.profilePhoto ||
    user.avatar ||
    user.image ||
    ""
  );

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Check image type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    // Optional size limit: 2 MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Please select an image smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const handleRemoveImage = () => {
    setProfileImage("");
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    const updatedUser = {
      ...user,

      name: name.trim(),

      phone: phone.trim(),

      // Save profile image
      photo: profileImage
    };

    // Save updated user
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    // Save profile fallback
    localStorage.setItem(
      "profile",
      JSON.stringify({
        id:
          updatedUser._id ||
          updatedUser.id ||
          "",

        name:
          updatedUser.name || "",

        email:
          updatedUser.email || "",

        phone:
          updatedUser.phone || "",

        photo:
          updatedUser.photo || ""
      })
    );

    // Update Navbar immediately
    window.dispatchEvent(
      new Event("authChange")
    );

    // Return to profile
    navigate("/profile", {
      replace: true
    });
  };

  // =====================================================
  // GET INITIAL
  // =====================================================

  const getInitial = () => {
    const value =
      name ||
      user.email ||
      "U";

    return value
      .charAt(0)
      .toUpperCase();
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="edit-profile-page">

      <div className="edit-profile-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="edit-profile-header">

          <h1>
            Edit Profile
          </h1>

          <p className="edit-profile-subtitle">
            Update your personal information
          </p>

        </div>

        {/* =================================================
            PROFILE IMAGE
        ================================================= */}

        <div className="edit-profile-image-section">

          <div className="edit-profile-avatar">

            {profileImage ? (

              <img
                src={profileImage}
                alt="Profile"
              />

            ) : (

              <span>
                {getInitial()}
              </span>

            )}

          </div>

          <div className="image-actions">

            <label
              htmlFor="profile-image"
              className="upload-image-btn"
            >
              📷 Change Photo
            </label>

            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />

            {profileImage && (

              <button
                type="button"
                className="remove-image-btn"
                onClick={handleRemoveImage}
              >
                Remove Photo
              </button>

            )}

          </div>

          <small className="image-help">
            JPG, PNG or WEBP • Maximum 2 MB
          </small>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSave}>

          {/* NAME */}

          <div className="edit-field">

            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
            />

          </div>

          {/* EMAIL */}

          <div className="edit-field">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={user.email || ""}
              disabled
            />

            <small>
              Email cannot be changed.
            </small>

          </div>

          {/* PHONE */}

          <div className="edit-field">

            <label htmlFor="phone">
              Phone
            </label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter your phone number"
            />

          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="edit-profile-actions">

            <button
              type="button"
              className="cancel-edit-btn"
              onClick={() =>
                navigate("/profile")
              }
            >
              ← Cancel
            </button>

            <button
              type="submit"
              className="save-profile-btn"
            >
              ✓ Save Changes
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProfile;