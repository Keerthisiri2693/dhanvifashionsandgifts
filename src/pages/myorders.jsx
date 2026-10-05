import "./myorders.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://dhanvifashionbackend.onrender.com/api";



// =====================================================
// GET USER ID
// =====================================================

const getUserId = () => {
  let userId = localStorage.getItem("userId");

  if (!userId) {
  

    localStorage.setItem(
      "userId",
      userId
    );
  }

  return userId;
};


// =====================================================
// IMAGE URL
// =====================================================

const getImageUrl = (image) => {

  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `https://dhanvifashionbackend.onrender.com${image}`;
};


// =====================================================
// FORMAT PRICE
// =====================================================

const formatPrice = (price) => {

  return Number(price || 0).toLocaleString(
    "en-IN"
  );

};


// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {

  if (!date) {
    return "Date not available";
  }

  try {

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  } catch {
    return "Date not available";
  }

};


// =====================================================
// STATUS CLASS
// =====================================================

const getStatusClass = (status) => {

  switch (
    String(status || "")
      .toLowerCase()
  ) {

    case "delivered":
      return "delivered";

    case "shipped":
      return "shipped";

    case "processing":
      return "processing";

    case "placed":
      return "placed";

    case "cancelled":
      return "cancelled";

    case "cancelled":
      return "cancelled";

    default:
      return "processing";
  }

};


// =====================================================
// MY ORDERS
// =====================================================

function MyOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // LOAD ORDERS
  // ===================================================

  useEffect(() => {

    fetchOrders();

  }, []);


  // ===================================================
  // FETCH USER ORDERS
  // ===================================================

  const fetchOrders = async () => {

    try {

      setLoading(true);
      setError("");

      const userId =
        getUserId();

      console.log(
        "================================="
      );

      console.log(
        "📦 GET USER ORDERS"
      );

      console.log(
        "👤 User ID:",
        userId
      );

      console.log(
        "🌐 API:",
        `${API_URL}/orders/user/${userId}`
      );

      console.log(
        "================================="
      );


      const response =
        await fetch(
          `${API_URL}/orders/user/${userId}`
        );


      const data =
        await response.json();


      console.log(
        "📦 ORDERS API RESPONSE:",
        data
      );


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
            "Failed to fetch orders"
        );

      }


      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );

    } catch (err) {

      console.error(
        "❌ GET ORDERS ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to load orders"
      );

    } finally {

      setLoading(false);

    }

  };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <div className="orders-page">

        <div className="orders-header">

          <h1>
            My Orders
          </h1>

          <p>
            Loading your orders...
          </p>

        </div>


        <div className="orders-loading">

          <div className="orders-spinner"></div>

          <p>
            Please wait...
          </p>

        </div>

      </div>

    );

  }


  // ===================================================
  // ERROR
  // ===================================================

  if (error) {

    return (

      <div className="orders-page">

        <div className="orders-header">

          <h1>
            My Orders
          </h1>

        </div>


        <div className="orders-error">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Unable to load orders
          </h2>

          <p>
            {error}
          </p>

          <button
            className="retry-btn"
            onClick={fetchOrders}
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  // ===================================================
  // EMPTY ORDERS
  // ===================================================

  if (orders.length === 0) {

    return (

      <div className="orders-page">

        <div className="orders-header">

          <h1>
            My Orders
          </h1>

          <p>
            View and track your recent purchases
          </p>

        </div>


        <div className="empty-orders">

          <div className="empty-orders-icon">
            🛍️
          </div>

          <h2>
            No Orders Yet
          </h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <button
            className="shop-now-btn"
            onClick={() =>
              navigate("/shop")
            }
          >
            Start Shopping
            <span>→</span>
          </button>

        </div>

      </div>

    );

  }


  // ===================================================
  // ORDERS
  // ===================================================

  return (

    <div className="orders-page">

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="orders-header">

        <div>

          <h1>
            My Orders
          </h1>

          <p>
            View and track your recent purchases
          </p>

        </div>

        <span className="orders-count">

          {orders.length}{" "}

          {orders.length === 1
            ? "Order"
            : "Orders"}

        </span>

      </div>


      {/* ============================================= */}
      {/* ORDERS LIST */}
      {/* ============================================= */}

      <div className="orders-container">

        {orders.map((order) => {

          /*
           * Backend structure:
           *
           * order.items = [
           *   {
           *     productId,
           *     name,
           *     price,
           *     quantity,
           *     image,
           *     category,
           *     itemTotal
           *   }
           * ]
           */

          const firstItem =
            order.items?.[0];


          const productName =
            firstItem?.name ||
            "Product";


          const image =
            getImageUrl(
              firstItem?.image
            );


          const itemCount =
            Array.isArray(
              order.items
            )
              ? order.items.reduce(
                  (total, item) =>
                    total +
                    Number(
                      item.quantity || 0
                    ),
                  0
                )
              : 0;


          const status =
            order.orderStatus ||
            "placed";


          return (

            <div
              className="order-card"
              key={
                order._id ||
                order.orderId
              }
            >

              {/* =================================== */}
              {/* PRODUCT IMAGE */}
              {/* =================================== */}

              <div className="order-img-box">

                {image ? (

                  <img
                    src={image}
                    alt={productName}
                    onError={(e) => {

                      e.currentTarget.style.display =
                        "none";

                    }}
                  />

                ) : (

                  <div className="order-placeholder">
                    🎁
                  </div>

                )}

              </div>


              {/* =================================== */}
              {/* ORDER DETAILS */}
              {/* =================================== */}

              <div className="order-details">

                <h3>
                  {productName}
                </h3>


                {/* Multiple Products */}

                {order.items?.length > 1 && (

                  <p className="more-products">

                    +{" "}
                    {order.items.length - 1}

                    {" "}

                    {order.items.length - 1 === 1
                      ? "more item"
                      : "more items"}

                  </p>

                )}


                {/* ORDER ID */}

                <p className="order-id">

                  Order ID:{" "}

                  <strong>
                    {order.orderId}
                  </strong>

                </p>


                {/* DATE */}

                <p className="order-date">

                  Ordered on:{" "}

                  {formatDate(
                    order.createdAt
                  )}

                </p>


                {/* ITEM COUNT */}

                <p className="order-items-count">

                  {itemCount}{" "}

                  {itemCount === 1
                    ? "item"
                    : "items"}

                </p>


                {/* TOTAL */}

                <p className="order-price">

                  ₹
                  {formatPrice(
                    order.total
                  )}

                </p>


                {/* STATUS */}

                <span
                  className={`order-status ${getStatusClass(
                    status
                  )}`}
                >

                  {String(status)
                    .charAt(0)
                    .toUpperCase() +
                    String(status)
                      .slice(1)}

                </span>

              </div>


              {/* =================================== */}
              {/* PAYMENT */}
              {/* =================================== */}

              <div className="order-payment">

                <span className="payment-label">
                  Payment
                </span>

                <strong>

                  {order.paymentMethod ===
                  "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}

                </strong>

                <span
                  className={`payment-status ${
                    order.paymentStatus ||
                    "pending"
                  }`}
                >

                  {String(
                    order.paymentStatus ||
                      "pending"
                  )
                    .charAt(0)
                    .toUpperCase() +
                    String(
                      order.paymentStatus ||
                        "pending"
                    ).slice(1)}

                </span>

              </div>


              {/* =================================== */}
              {/* ACTIONS */}
              {/* =================================== */}

              <div className="order-actions">

              <button
  className="view-btn"
  onClick={() =>
    navigate(
      `/orderdetails/${order.orderId}`
    )
  }
>
  View Details
</button>


                <button
                  className="track-btn"
                  onClick={() =>
                    navigate(
                      `/trackorders/${order.orderId}`
                    )
                  }
                >
                  Track Order
                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}

export default MyOrders;