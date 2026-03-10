import { useParams } from "react-router-dom";
import "./viewdetails.css";
import soap from "../assets/soap.jpg"

function OrderDetails() {

  const { id } = useParams();

  const order = {
    id: id,
    product: "Rose Soap Gift Pack",
    price: "₹299",
    status: "Delivered",
    date: "12 Feb 2026",
    address: "No.21, Anna Nagar, Chennai",
    payment: "UPI",
    image: soap,
  };

  return (
    <div className="order-details-page">

      <h1>Order Details</h1>

      <div className="order-details-card">

        <img src={order.image} alt={order.product} />

        <div className="order-info">

          <h2>{order.product}</h2>

          <p><b>Order ID:</b> {order.id}</p>

          <p><b>Order Date:</b> {order.date}</p>

          <p><b>Price:</b> {order.price}</p>

          <p><b>Payment Method:</b> {order.payment}</p>

          <p><b>Delivery Address:</b> {order.address}</p>

          <span className={`status ${order.status.toLowerCase()}`}>
            {order.status}
          </span>

        </div>

      </div>

    </div>
  );
}

export default OrderDetails;