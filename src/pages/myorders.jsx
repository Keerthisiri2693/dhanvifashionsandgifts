import "./MyOrders.css";
import soap from "../assets/soap.jpg";
import accessory from "../assets/accessory.jpg";
import birthday from "../assets/birthday.jpg"
import { useNavigate } from "react-router-dom";


function MyOrders() {
const navigate = useNavigate();

  const orders = [
    {
      id: "ORD12345",
      product: "Rose Soap Gift Pack",
      price: "₹299",
      status: "Delivered",
      date: "12 Feb 2026",
      image: soap,
    },
    {
      id: "ORD12346",
      product: "Women Fashion Earrings",
      price: "₹199",
      status: "Shipped",
      date: "15 Feb 2026",
      image: accessory,
    },
    {
      id: "ORD12347",
      product: "Birthday Return Gift Box",
      price: "₹499",
      status: "Processing",
      date: "18 Feb 2026",
      image: birthday,
    }
  ];

  return (
    <div className="orders-page">

      <h1>My Orders</h1>

      <div className="orders-container">

        {orders.map((order) => (

          <div className="order-card" key={order.id}>

            {/* Product Image */}
            <div className="order-img-box">
              <img src={order.image} alt={order.product}/>
            </div>

            {/* Order Details */}
            <div className="order-details">

              <h3>{order.product}</h3>

              <p className="order-id">
                Order ID : {order.id}
              </p>

              <p className="order-date">
                Ordered on : {order.date}
              </p>

              <p className="order-price">
                {order.price}
              </p>

              <span className={`order-status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>

            </div>

       

<div className="order-actions">

  <button
    className="view-btn"
    onClick={() => navigate(`/viewdetails`)}
  >
    View Details
  </button>

  <button className="track-btn"
  onClick={() => navigate(`/trackorders`)}
  >
    Track Order
  </button>

</div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MyOrders;