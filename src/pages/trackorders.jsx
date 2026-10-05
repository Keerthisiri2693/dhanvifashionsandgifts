import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/orderApi";
import "./trackorders.css";

function TrackOrder() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(orderId);

        console.log("📦 TRACK ORDER:", data);

        setOrder(data);
      } catch (error) {
        console.error("❌ TRACK ORDER ERROR:", error);
        setError(
          error.message || "Unable to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="track-page">
        <div className="track-loading">
          Loading order...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="track-page">
        <div className="track-error">
          <div className="track-error-icon">
            ⚠️
          </div>

          <h2>Order Not Found</h2>

          <p>
            {error || "Unable to find this order."}
          </p>

          <Link to="/myorders">
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  const status =
    String(order.orderStatus || "placed")
      .toLowerCase();

  const steps = [
    {
      key: "placed",
      icon: "✓",
      title: "Order Placed",
      description:
        "Your order has been received",
    },
    {
      key: "confirmed",
      icon: "📦",
      title: "Order Confirmed",
      description:
        "Your order is being prepared",
    },
    {
      key: "shipped",
      icon: "🚚",
      title: "Shipped",
      description:
        "Your order is on the way",
    },
    {
      key: "delivered",
      icon: "🎉",
      title: "Delivered",
      description:
        "Order delivered successfully",
    },
  ];

  const statusOrder = [
    "placed",
    "confirmed",
    "shipped",
    "delivered",
  ];

  const currentIndex =
    statusOrder.indexOf(status);

  return (
    <div className="track-page">

      {/* HEADER */}

      <div className="track-header">

        <div>
          <p className="track-label">
            ORDER TRACKING
          </p>

          <h1>
            Track Your Order
          </h1>

          <p>
            Order ID:{" "}
            <strong>
              {order.orderId}
            </strong>
          </p>
        </div>

        <Link
          to="/myorders"
          className="back-orders-btn"
        >
          ← My Orders
        </Link>

      </div>

      <div className="track-container">

        {/* STATUS CARD */}

        <div className="tracking-card">

          <div className="tracking-card-header">

            <div>
              <h2>
                Delivery Status
              </h2>

              <p>
                Follow your order journey
              </p>
            </div>

            <span
              className={`current-status ${status}`}
            >
              {status === "delivered"
                ? "Delivered"
                : status === "shipped"
                ? "Shipped"
                : status === "confirmed"
                ? "Confirmed"
                : "Order Placed"}
            </span>

          </div>

          {/* TIMELINE */}

          <div className="tracking-timeline">

            {steps.map((step, index) => {

              const completed =
                currentIndex >= index;

              const active =
                currentIndex === index;

              return (
                <div
                  className={`tracking-step ${
                    completed
                      ? "completed"
                      : ""
                  } ${
                    active
                      ? "active"
                      : ""
                  }`}
                  key={step.key}
                >

                  <div className="timeline-left">

                    <div className="timeline-icon">
                      {step.icon}
                    </div>

                    {index !==
                      steps.length - 1 && (
                      <div className="timeline-line" />
                    )}

                  </div>

                  <div className="timeline-content">

                    <h3>
                      {step.title}
                    </h3>

                    <p>
                      {step.description}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

        {/* ORDER INFORMATION */}

        <div className="track-info-grid">

          {/* DELIVERY */}

          <div className="track-info-card">

            <div className="info-icon">
              📍
            </div>

            <div>
              <h3>
                Delivery Address
              </h3>

              <p>
                {order.shippingAddress?.name}
              </p>

              <p>
                {order.shippingAddress?.address}
              </p>

              <p>
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.state}
              </p>

              <p>
                {order.shippingAddress?.pincode}
              </p>

            </div>

          </div>

          {/* PAYMENT */}

          <div className="track-info-card">

            <div className="info-icon">
              💳
            </div>

            <div>
              <h3>
                Payment
              </h3>

              <p>
                {order.paymentMethod ===
                "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </p>

              <strong>
                ₹
                {Number(
                  order.total || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

          </div>

        </div>

        {/* PRODUCTS */}

        <div className="tracking-products">

          <h2>
            Order Items
          </h2>

          {order.items?.map(
            (item, index) => {

              const imageUrl =
                item.image?.startsWith(
                  "http"
                )
                  ? item.image
                  : item.image
                  ? `https://dhanvifashionbackend.onrender.com${item.image}`
                  : "";

              return (
                <div
                  className="tracking-product"
                  key={
                    item.productId ||
                    index
                  }
                >

                  <div className="tracking-product-image">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                      />
                    ) : (
                      <span>
                        🎁
                      </span>
                    )}

                  </div>

                  <div className="tracking-product-details">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      Qty: {item.quantity}
                    </p>

                  </div>

                  <strong>
                    ₹
                    {Number(
                      item.itemTotal ||
                      item.price *
                        item.quantity ||
                      0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}

export default TrackOrder;