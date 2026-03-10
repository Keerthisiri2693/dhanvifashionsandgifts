import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
import shoplogo from "../assets/dhanvifashionlogo.png";

function Navbar({ cart }) {

const [menuOpen, setMenuOpen] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);

const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

useEffect(() => {
const user = localStorage.getItem("user");
if (user) {
setIsLoggedIn(true);
}
}, []);

const closeMenu = () => {
setMenuOpen(false);
};

return (

<header className="navbar">

<div className="nav-container">

{/* LOGO */}

<Link to="/" className="logo" onClick={closeMenu}>
<img
src={shoplogo}
alt="Dhanvi Fashion & Gifts Logo"
loading="lazy"
/>
<span>Dhanvi Fashion & Gifts</span>
</Link>

{/* MOBILE MENU */}

<button
className="menu-btn"
onClick={() => setMenuOpen(!menuOpen)}
aria-label="Toggle menu"

>

☰ </button>

{/* NAV LINKS */}

<nav className={`nav-links ${menuOpen ? "active" : ""}`}>

<Link to="/" onClick={closeMenu}>Home</Link>
<Link to="/shop" onClick={closeMenu}>Shop</Link>
<Link to="/categories" onClick={closeMenu}>Categories</Link>
<Link to="/myorders" onClick={closeMenu}>My Orders</Link>
<Link to="/about" onClick={closeMenu}>About</Link>
<Link to="/contact" onClick={closeMenu}>Contact</Link>

</nav>

{/* RIGHT SIDE */}

<div className="nav-right">

{/* SEARCH */}

<div className="search-box">

<input
type="text"
placeholder="Search products..."
/>

<button type="button">🔍</button>

</div>

{/* LOGIN / PROFILE */}

{isLoggedIn ? (

<Link to="/profile" className="profile-btn">
👤
</Link>

) : (

<Link to="/login" className="login-btn">
Login
</Link>

)}

{/* CART */}

<Link to="/cart" className="cart-btn">

🛒

{totalItems > 0 && ( <span className="cart-count">{totalItems}</span>
)}

</Link>

</div>

</div>

</header>

);

}

export default Navbar;
