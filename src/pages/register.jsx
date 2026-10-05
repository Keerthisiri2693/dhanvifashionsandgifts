import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../auth";
import "./register.css";

function Register() {

const navigate = useNavigate();

const [form, setForm] = useState({
name: "",
email: "",
password: ""
});

const handleChange = (e) => {


setForm({
  ...form,
  [e.target.name]: e.target.value
});


};

const handleRegister = async (e) => {
  e.preventDefault();

  if (!form.name || !form.email || !form.password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await fetch(
      "https://dhanvifashionbackend.onrender.com/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Registration successful!");

    // Go to login after registration
    navigate("/login");

  } catch (error) {
    console.error("Registration Error:", error);
    alert("Unable to connect to server");
  }
};


return (


<div className="register-page">

  <div className="register-card">

    <h2>Create Account</h2>

    <form onSubmit={handleRegister}>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <button type="submit">
        Register
      </button>

    </form>

    <p>
      Already have an account? 
      <Link to="/login"> Login</Link>
    </p>

  </div>

</div>


);

}

export default Register;
