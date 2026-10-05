import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const API_URL = "https://dhanvifashionbackend.onrender.com/api";

function Login() {
  const navigate = useNavigate();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // =====================================================
  // LOGIN STATE
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // CHECK ALREADY LOGGED IN
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/profile", { replace: true });
    }
  }, [navigate]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

const handleLogin = async (e) => {
  e.preventDefault();

  const email = form.email.trim();
  const password = form.password;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    console.log("=================================");
    console.log("🔐 LOGIN RESPONSE");
    console.log(data);
    console.log("=================================");

    // =================================================
    // LOGIN FAILED
    // =================================================

    if (!response.ok) {
      alert(
        data.message ||
          "Invalid email or password"
      );

      return;
    }

    // =================================================
    // CHECK TOKEN
    // =================================================

    if (!data.token) {
      console.error(
        "❌ Backend did not return token:",
        data
      );

      alert(
        "Login failed. Server did not return a token."
      );

      return;
    }

    // =================================================
    // CHECK USER
    // =================================================

    if (!data.user) {
      console.error(
        "❌ Backend did not return user:",
        data
      );

      alert(
        "Login failed. Server did not return user information."
      );

      return;
    }

    // =================================================
    // GET REAL USER ID
    // =================================================

    const userId =
      data.user._id ||
      data.user.id;

    if (!userId) {
      console.error(
        "❌ User ID missing:",
        data.user
      );

      alert(
        "Login failed. User ID was not returned by server."
      );

      return;
    }

    // =================================================
    // SAVE TOKEN
    // =================================================

    localStorage.setItem(
      "token",
      data.token
    );

    // =================================================
    // SAVE REAL USER ID
    // =================================================

    localStorage.setItem(
      "userId",
      String(userId)
    );

    // =================================================
    // SAVE USER
    // =================================================

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    // =================================================
    // SAVE PROFILE
    // =================================================

    localStorage.setItem(
      "profile",
      JSON.stringify({
        id: userId,

        name:
          data.user.name || "",

        email:
          data.user.email || "",

        phone:
          data.user.phone || "",

        photo:
          data.user.photo ||
          data.user.profilePhoto ||
          "",
      })
    );

    // =================================================
    // DEBUG
    // =================================================

    console.log("=================================");
    console.log("✅ LOGIN SUCCESS");
    console.log("👤 USER ID:", userId);
    console.log("🔑 TOKEN EXISTS:", true);
    console.log("=================================");

    // =================================================
    // UPDATE NAVBAR
    // =================================================

    window.dispatchEvent(
      new Event("storage")
    );

    // =================================================
    // SUCCESS
    // =================================================

    alert("Login successful!");

    // =================================================
    // GO TO PROFILE
    // =================================================

    navigate(
      "/profile",
      {
        replace: true,
      }
    );

  } catch (error) {
    console.error(
      "❌ LOGIN ERROR:",
      error
    );

    alert(
      "Unable to connect to server. Please make sure the backend is running."
    );

  } finally {
    setLoading(false);
  }
};

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="login-page">

      <div className="login-card">

        <h2>
          Login
        </h2>

        <form
          onSubmit={handleLogin}
        >

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
            disabled={loading}
          />

          {/* PASSWORD */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            disabled={loading}
          />

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

        {/* REGISTER */}

        <p>

          Don't have an account?

          <Link to="/register">
            {" "}Register
          </Link>

        </p>

      </div>

    </div>

  );
}

export default Login;