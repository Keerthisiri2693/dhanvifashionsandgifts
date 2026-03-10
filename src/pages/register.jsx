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

const handleRegister = (e) => {


e.preventDefault();

if(!form.name || !form.email || !form.password){
  alert("Please fill all fields");
  return;
}

loginUser(form);

navigate("/profile");

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
