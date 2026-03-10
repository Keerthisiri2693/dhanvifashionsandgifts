import { useState } from "react";
import "./trackorders.css";

function TrackOrder() {

const [orderId, setOrderId] = useState("");
const [order, setOrder] = useState(null);

const handleTrack = (e) => {


e.preventDefault();

if(!orderId){
  alert("Enter Order ID");
  return;
}

// Example order data
const sampleOrder = {
  id: orderId,
  status: "Shipped",
  date: "10 March 2026",
  items: ["Rose Soap Gift Pack"],
  address: "Anna Nagar, Chennai"
};

setOrder(sampleOrder);


};

return (


<div className="track-page">

  <div className="track-card">

    <h2>Track Your Order</h2>

    <form onSubmit={handleTrack}>

      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e)=>setOrderId(e.target.value)}
      />

      <button type="submit">
        Track Order
      </button>

    </form>

    {order && (

      <div className="order-status">

        <h3>Order #{order.id}</h3>

        <p><strong>Status:</strong> {order.status}</p>

        <p><strong>Order Date:</strong> {order.date}</p>

        <p><strong>Delivery Address:</strong> {order.address}</p>

        <p><strong>Items:</strong> {order.items.join(", ")}</p>

      </div>

    )}

  </div>

</div>


);

}

export default TrackOrder;
