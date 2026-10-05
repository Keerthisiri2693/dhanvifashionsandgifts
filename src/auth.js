// =====================================================
// AUTH.JS
// =====================================================

const API_URL = "https://dhanvifashionbackend.onrender.com/api";

// =====================================================
// LOGIN USER
// =====================================================

export async function loginUser(email, password) {
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

  if (!response.ok) {
    throw new Error(
      data.message || "Invalid email or password"
    );
  }

  if (!data.token) {
    throw new Error(
      "Server did not return a token."
    );
  }

  // Save token
  localStorage.setItem(
    "token",
    data.token
  );

  // Save user
  if (data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );
  }

  // Save profile
  if (data.user) {
    const profile = {
      id:
        data.user._id ||
        data.user.id ||
        "",

      name:
        data.user.name ||
        "",

      email:
        data.user.email ||
        "",

      phone:
        data.user.phone ||
        "",

      photo:
        data.user.photo ||
        data.user.profilePhoto ||
        "",
    };

    localStorage.setItem(
      "profile",
      JSON.stringify(profile)
    );
  }

  // Update Navbar
  window.dispatchEvent(
    new Event("auth-change")
  );

  return data;
}

// =====================================================
// LOGOUT
// =====================================================

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("profile");

  window.dispatchEvent(
    new Event("auth-change")
  );
}

// =====================================================
// AUTHENTICATION CHECK
// =====================================================

export function isAuthenticated() {
  const token =
    localStorage.getItem("token");

  return !!token;
}

// =====================================================
// GET USER
// =====================================================

export function getCurrentUser() {
  try {
    const user =
      localStorage.getItem("user");

    if (!user) {
      return null;
    }

    return JSON.parse(user);

  } catch (error) {

    console.error(
      "Get user error:",
      error
    );

    return null;
  }
}

// =====================================================
// GET TOKEN
// =====================================================

export function getToken() {
  return localStorage.getItem("token");
}