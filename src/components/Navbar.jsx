import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import "./Navbar.css";

import logo from "../assets/logo.png";

function Navbar({ cart = [] }) {

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // =====================================================
  // CHECK LOGIN
  // =====================================================

  useEffect(() => {

    const checkLogin = () => {

      const token =
        localStorage.getItem("token");

      const userId =
        localStorage.getItem("userId");

      const savedUser =
        localStorage.getItem("user");

      const validUserId =
        userId &&
        userId !== "1" &&
        userId !== "null" &&
        userId !== "undefined";

      const isLoggedIn =
        Boolean(token) &&
        Boolean(validUserId);

      console.log("=================================");
      console.log("🔐 NAVBAR LOGIN CHECK");
      console.log("🔑 Token:", Boolean(token));
      console.log("👤 User ID:", userId);
      console.log("✅ Logged In:", isLoggedIn);
      console.log("=================================");

      setLoggedIn(isLoggedIn);

      if (isLoggedIn && savedUser) {

        try {

          const parsedUser =
            JSON.parse(savedUser);

          setUser(parsedUser);

        } catch (error) {

          console.error(
            "❌ Invalid user data:",
            error
          );

          setUser(null);
        }

      } else {

        setUser(null);
      }
    };

    checkLogin();

    window.addEventListener(
      "authChange",
      checkLogin
    );

    return () => {

      window.removeEventListener(
        "authChange",
        checkLogin
      );

    };

  }, []);

  // =====================================================
  // CART COUNT
  // =====================================================

  const cartCount = Array.isArray(cart)
    ? cart.reduce(
        (total, item) => {

          return (
            total +
            Number(item?.quantity || 1)
          );

        },
        0
      )
    : 0;

  // =====================================================
  // CART DEBUG
  // =====================================================

  useEffect(() => {

    console.log("=================================");
    console.log("🛒 NAVBAR CART UPDATED");
    console.log("🛒 CART:", cart);
    console.log("🛒 CART COUNT:", cartCount);
    console.log("=================================");

  }, [cart, cartCount]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    console.log(
      "🚪 LOGGING OUT"
    );

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");

    setLoggedIn(false);
    setUser(null);

    window.dispatchEvent(
      new Event("authChange")
    );

    navigate("/", {
      replace: true,
    });

  };

  // =====================================================
  // NAVIGATION STYLE
  // =====================================================

  const navStyle = ({ isActive }) => ({
    textDecoration: "none",

    color: isActive
      ? "#ff4d6d"
      : "#222",

    fontWeight: isActive
      ? "600"
      : "500",
  });

  // =====================================================
  // USER NAME
  // =====================================================

  const getUserName = () => {

    if (user?.name) {
      return user.name;
    }

    if (user?.email) {
      return user.email.split("@")[0];
    }

    return "User";
  };

  // =====================================================
  // USER INITIAL
  // =====================================================

  const getInitial = () => {

    const name =
      user?.name ||
      user?.email ||
      "U";

    return name
      .charAt(0)
      .toUpperCase();
  };

  // =====================================================
  // PROFILE PHOTO
  // =====================================================

  const getProfilePhoto = () => {

    return (
      user?.photo ||
      user?.profilePhoto ||
      user?.avatar ||
      user?.image ||
      null
    );
  };

  // =====================================================
  // PROFILE AVATAR
  // =====================================================

  const ProfileAvatar = () => {

    const photo =
      getProfilePhoto();

    if (photo) {

      return (
        <img
          src={photo}
          alt="Profile"
          className="profile-nav-avatar-image"
          onError={(event) => {
            event.currentTarget.style.display =
              "none";
          }}
        />
      );

    }

    return (
      <span className="profile-nav-avatar">
        {getInitial()}
      </span>
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <nav className="navbar">

      {/* =================================================
          LEFT
      ================================================= */}

      <div className="navbar-left">

        <div className="navbar-logo">

          <Link to="/">

            <img
              src={logo}
              alt="Dhanvi Fashion & Gifts"
            />

          </Link>

        </div>

        <div className="brand-name">

          <Link to="/">
            Dhanvi Fashion & Gifts
          </Link>

        </div>

      </div>

      {/* =================================================
          MENU
      ================================================= */}

      <div className="navbar-menu">

        <NavLink
          to="/"
          style={navStyle}
        >
          Home
        </NavLink>

        <NavLink
          to="/shop"
          style={navStyle}
        >
          Shop
        </NavLink>

        <NavLink
          to="/categories"
          style={navStyle}
        >
          Categories
        </NavLink>

        <NavLink
          to="/myorders"
          style={navStyle}
        >
          My Orders
        </NavLink>

        <NavLink
          to="/about"
          style={navStyle}
        >
          About
        </NavLink>

        <NavLink
          to="/contact"
          style={navStyle}
        >
          Contact
        </NavLink>

      </div>

      {/* =================================================
          RIGHT
      ================================================= */}

      <div className="navbar-right">

        {/* SEARCH */}

        <div className="search-box">

          <input
            type="text"
            placeholder="Search products..."
          />

          <button
            type="button"
            aria-label="Search"
          >
            🔍
          </button>

        </div>

        {/* =================================================
            PROFILE / LOGIN
        ================================================= */}

        {loggedIn ? (

          <div className="profile-nav-container">

            <Link
              to="/profile"
              className="profile-nav-btn"
              title={getUserName()}
            >

              <span className="profile-avatar-wrapper">

                <ProfileAvatar />

              </span>

              <span className="profile-nav-text">

                {getUserName()}

              </span>

            </Link>

            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        ) : (

          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>

        )}

        {/* =================================================
            CART
        ================================================= */}

        <Link
          to="/cart"
          className="cart-link"
          aria-label="Shopping cart"
        >

          <span className="cart-icon">
            🛒
          </span>

          {/* =================================================
              CART COUNT
          ================================================= */}

          {cartCount > 0 && (

            <span className="cart-count">
              {cartCount}
            </span>

          )}

        </Link>

      </div>

    </nav>
  );
}

export default Navbar;