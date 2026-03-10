import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./orderconfirmation.css";

function OrderConfirmation() {

  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const id = Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(id);
  }, []);

  return (
    <div className="order-confirm-page">

      <div className="order-card">

        <div className="success-icon">🎉</div>

        <h1>Order Placed Successfully!</h1>

        <p>
          Thank you for shopping with <b>Dhanvi Fashion & Gifts</b>.
        </p>

        <p>Your Order ID</p>

        <h2 className="order-id">#{orderNumber}</h2>

        <p className="order-message">
          Your order has been confirmed and will be shipped soon.
        </p>

        <div className="order-buttons">

          <Link to="/">
            <button className="home-btn">
              Continue Shopping
            </button>
          </Link>

          <Link to="/myorders">
            <button className="orders-btn">
              View Orders
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default OrderConfirmation;