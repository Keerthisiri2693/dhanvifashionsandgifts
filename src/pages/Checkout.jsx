import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "cod"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Order Details:", formData);

    // redirect to confirmation page
    navigate("/orderconfirmation");
  };

  return (
    <div className="checkout-page">

      <h1>Checkout 🛍</h1>

      <div className="checkout-container">

        {/* SHIPPING FORM */}

        <div className="checkout-form">

          <h2>Shipping Details</h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              required
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              required
              onChange={handleChange}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              required
              onChange={handleChange}
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              required
              onChange={handleChange}
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              required
              onChange={handleChange}
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              required
              onChange={handleChange}
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              required
              onChange={handleChange}
            />

            {/* PAYMENT */}

            <h3>Payment Method</h3>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={formData.payment === "cod"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={formData.payment === "online"}
                onChange={handleChange}
              />
              Online Payment
            </label>

            <button type="submit" className="place-order-btn">
              Place Order
            </button>

          </form>

        </div>


        {/* ORDER SUMMARY */}

        <div className="order-summary">

          <h2>Order Summary</h2>

          <div className="summary-item">
            <span>Kids Birthday Return Gift</span>
            <span>₹199</span>
          </div>

          <div className="summary-item">
            <span>Rose Organic Soap</span>
            <span>₹120</span>
          </div>

          <hr />

          <div className="summary-total">
            <h3>Total</h3>
            <h3>₹319</h3>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;