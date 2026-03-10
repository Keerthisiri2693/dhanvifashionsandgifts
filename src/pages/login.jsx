import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../auth";
import "./login.css";

function Login() {

const navigate = useNavigate();

const [form, setForm] = useState({
email: "",
password: ""
});

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value
});
};

const handleLogin = (e) => {


e.preventDefault();

if (!form.email || !form.password) {
  alert("Please fill all fields");
  return;
}

loginUser({
  email: form.email
});

navigate("/profile");


};

return (


<div className="login-page">

  <div className="login-card">

    <h2>Login</h2>

    <form onSubmit={handleLogin}>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <button type="submit">
        Login
      </button>

    </form>

    <p>
      Don't have an account? 
      <Link to="/register"> Register</Link>
    </p>

  </div>

</div>


);

}

export default Login;
