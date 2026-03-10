import { useState, useEffect } from "react";
import "./Profile.css";
import soap from "../assets/soap.jpg";
import earning from "../assets/accessory.jpg";

function ProfileDashboard() {

const [active, setActive] = useState("profile");
const [editMode, setEditMode] = useState(false);

const [profile, setProfile] = useState({
name: "Keerthana",
email: "[keerthana@gmail.com](mailto:keerthana@gmail.com)",
phone: "+91 9876543210"
});

const [wishlistItems, setWishlistItems] = useState([]);

const [addresses, setAddresses] = useState([]);
const [editingIndex, setEditingIndex] = useState(null);
const [showForm, setShowForm] = useState(false);

const [addressForm, setAddressForm] = useState({
name: "",
street: "",
city: "",
state: "",
mobile: ""
});

/* LOAD ADDRESSES */

useEffect(() => {
const saved = JSON.parse(localStorage.getItem("addresses")) || [];
setAddresses(saved);
}, []);

/* LOAD PROFILE */

useEffect(() => {
const savedProfile = JSON.parse(localStorage.getItem("profile"));
if (savedProfile) {
setProfile(savedProfile);
}
}, []);

/* LOAD WISHLIST */

useEffect(() => {

const favs = JSON.parse(localStorage.getItem("favorites")) || [];

const products = [
{ id: 1, name: "Rose Soap", price: 299, image: soap },
{ id: 2, name: "Fashion Earrings", price: 199, image: earning }
];

const filtered = products.filter(p => favs.includes(p.id));

setWishlistItems(filtered);

}, []);

/* PROFILE CHANGE */

const handleChange = (e) => {
setProfile({
...profile,
[e.target.name]: e.target.value
});
};

const saveProfile = () => {
localStorage.setItem("profile", JSON.stringify(profile));
setEditMode(false);
};

/* WISHLIST */

const removeFromWishlist = (id) => {

let favs = JSON.parse(localStorage.getItem("favorites")) || [];

favs = favs.filter(item => item !== id);

localStorage.setItem("favorites", JSON.stringify(favs));

setWishlistItems(wishlistItems.filter(item => item.id !== id));

};

/* ADDRESS CHANGE */

const handleAddressChange = (e) => {

setAddressForm({
...addressForm,
[e.target.name]: e.target.value
});

};

const saveAddress = () => {

if(!addressForm.name || !addressForm.street || !addressForm.city || !addressForm.mobile){
alert("Please fill all fields");
return;
}

let updated = [...addresses];

if (editingIndex !== null) {
updated[editingIndex] = addressForm;
} else {
updated.push(addressForm);
}

setAddresses(updated);
localStorage.setItem("addresses", JSON.stringify(updated));

setAddressForm({
name:"",
street:"",
city:"",
state:"",
mobile:""
});

setEditingIndex(null);
setShowForm(false);

};

const editAddress = (index) => {

setAddressForm(addresses[index]);
setEditingIndex(index);
setShowForm(true);

};

const deleteAddress = (index) => {

const updated = addresses.filter((_, i) => i !== index);

setAddresses(updated);

localStorage.setItem("addresses", JSON.stringify(updated));

};

const cancelAddress = () => {

setShowForm(false);
setEditingIndex(null);

setAddressForm({
name:"",
street:"",
city:"",
state:"",
mobile:""
});

};

const openAddAddress = () => {

setAddressForm({
name:"",
street:"",
city:"",
state:"",
mobile:""
});

setEditingIndex(null);
setShowForm(true);

};

return (

<div className="profile-dashboard">

{/* SIDEBAR */}

<div className="profile-sidebar">

<h3>My Account</h3>

<ul>

<li
className={active === "profile" ? "active" : ""}
onClick={() => setActive("profile")}
>
Profile
</li>

<li
className={active === "orders" ? "active" : ""}
onClick={() => setActive("orders")}
>
Orders
</li>

<li
className={active === "address" ? "active" : ""}
onClick={() => setActive("address")}
>
Saved Addresses
</li>

<li
className={active === "wishlist" ? "active" : ""}
onClick={() => setActive("wishlist")}
>
Wishlist
</li>

<li
className={active === "changepassword" ? "active" : ""}
onClick={() => setActive("changepassword")}
>
Change Password
</li>

</ul>

</div>

{/* CONTENT */}

<div className="profile-content">

{/* PROFILE */}

{active === "profile" && (

<div className="profile-section">

<h2>Profile</h2>

<div className="profile-card">

<img
src="https://i.pravatar.cc/120"
alt="User profile"
/>

<div className="profile-info">

{editMode ? (

<>

<input
type="text"
name="name"
value={profile.name}
onChange={handleChange}
/>

<input
type="email"
name="email"
value={profile.email}
onChange={handleChange}
/>

<input
type="text"
name="phone"
value={profile.phone}
onChange={handleChange}
/>

<div className="profile-buttons">

<button onClick={saveProfile}>
Save
</button>

<button
className="cancel-btn"
onClick={() => setEditMode(false)}

>

Cancel </button>

</div>

</>

) : (

<>

<p><strong>Name:</strong> {profile.name}</p>
<p><strong>Email:</strong> {profile.email}</p>
<p><strong>Phone:</strong> {profile.phone}</p>

<button
className="edit-btn"
onClick={() => setEditMode(true)}

>

Edit Profile </button>

</>

)}

</div>

</div>

</div>

)}

{/* ORDERS */}

{active === "orders" && (

<div className="orders-section">

<h2>My Orders</h2>

<div className="order-item">
<p>Rose Soap Gift Pack</p>
<span>₹299</span>
<span className="status delivered">Delivered</span>
</div>

<div className="order-item">
<p>Women Fashion Earrings</p>
<span>₹199</span>
<span className="status shipped">Shipped</span>
</div>

</div>

)}

{/* ADDRESS */}

{active === "address" && (

<div className="address-section">

<h2>Saved Addresses</h2>

{addresses.map((addr,index)=>(

<div className="address-card" key={index}>

<p><strong>{addr.name}</strong></p>
<p>{addr.street}</p>
<p>{addr.city}, {addr.state}</p>
<p>📞 {addr.mobile}</p>

<div className="address-buttons">

<button
className="edit-btn"
onClick={()=>editAddress(index)}

>

Edit </button>

<button
className="delete-btn"
onClick={()=>deleteAddress(index)}

>

Delete </button>

</div>

</div>

))}

<button
className="add-address-btn"
onClick={openAddAddress}

>

Add New Address </button>

{showForm && (

<div className="address-form">

<input
type="text"
name="name"
placeholder="Name"
value={addressForm.name}
onChange={handleAddressChange}
/>

<input
type="text"
name="mobile"
placeholder="Mobile Number"
value={addressForm.mobile}
onChange={handleAddressChange}
/>

<input
type="text"
name="street"
placeholder="Street Address"
value={addressForm.street}
onChange={handleAddressChange}
/>

<input
type="text"
name="city"
placeholder="City"
value={addressForm.city}
onChange={handleAddressChange}
/>

<input
type="text"
name="state"
placeholder="State"
value={addressForm.state}
onChange={handleAddressChange}
/>

<div className="form-buttons">

<button onClick={saveAddress}>
Save
</button>

<button
className="cancel-btn"
onClick={cancelAddress}

>

Cancel </button>

</div>

</div>

)}

</div>

)}

{/* WISHLIST */}

{active === "wishlist" && (

<div className="wishlist-section">

<h2>My Wishlist</h2>

<div className="wishlist-grid">

{wishlistItems.length === 0 ? (

<p>No items in wishlist</p>

) : (

wishlistItems.map(item => (

<div className="wishlist-card" key={item.id}>

<img src={item.image} alt={item.name}/>

<h4>{item.name}</h4>

<p className="price">₹{item.price}</p>

<div className="wishlist-buttons">

<button className="add-cart-btn">
Add to Cart
</button>

<button
className="remove-btn"
onClick={()=>removeFromWishlist(item.id)}

>

Remove </button>

</div>

</div>

))

)}

</div>

</div>

)}

{/* PASSWORD */}

{active === "changepassword" && (

<div className="settings-section">

<h2>Change Password</h2>

<form className="password-form">

<input type="password" placeholder="Current Password"/>

<input type="password" placeholder="New Password"/>

<input type="password" placeholder="Confirm Password"/>

<button type="submit">
Change Password
</button>

</form>

</div>

)}

</div>

</div>

);

}

export default ProfileDashboard;
