import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../auth";
import "./login.css";

function Login() {

const navigate = useNavigate();

/* LOGIN STATE */

const [isLoggedIn, setIsLoggedIn] = useState(false);

/* FORM STATE */

const [form, setForm] = useState({
email: "",
password: ""
});

/* CHECK IF USER ALREADY LOGGED IN */

useEffect(() => {

const user = localStorage.getItem("user");

if (user) {
setIsLoggedIn(true);
navigate("/profile");
}

}, [navigate]);

/* HANDLE INPUT CHANGE */

const handleChange = (e) => {

setForm({
...form,
[e.target.name]: e.target.value
});

};

/* HANDLE LOGIN */

const handleLogin = (e) => {

e.preventDefault();

/* VALIDATION */

if (!form.email || !form.password) {
alert("Please fill all fields");
return;
}

/* USER DATA */

const userData = {
email: form.email
};

/* SAVE USER */

loginUser(userData);

/* STORE USER */

localStorage.setItem("user", JSON.stringify(userData));

/* TRIGGER NAVBAR UPDATE */

window.dispatchEvent(new Event("storage"));

setIsLoggedIn(true);

/* REDIRECT */

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