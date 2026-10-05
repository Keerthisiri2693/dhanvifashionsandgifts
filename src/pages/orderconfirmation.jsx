import {
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import "./orderconfirmation.css";


// =====================================================
// ORDER CONFIRMATION
// =====================================================

function OrderConfirmation() {

  const location = useLocation();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // LOAD ORDER
  // =====================================================

  useEffect(() => {

    console.log("=================================");
    console.log("🎉 ORDER CONFIRMATION");
    console.log("=================================");


    // -------------------------------------------------
    // 1. ORDER FROM NAVIGATION STATE
    // -------------------------------------------------

    if (location.state?.order) {

      console.log(
        "📦 Order received from checkout:",
        location.state.order
      );

      const receivedOrder =
        location.state.order;


      setOrder(receivedOrder);


      // Save backend order
      // for browser refresh

      localStorage.setItem(
        "lastOrder",
        JSON.stringify(
          receivedOrder
        )
      );


      setLoading(false);

      return;
    }


    // -------------------------------------------------
    // 2. ORDER FROM LOCAL STORAGE
    // -------------------------------------------------

    const savedOrder =
      localStorage.getItem(
        "lastOrder"
      );


    if (savedOrder) {

      try {

        const parsedOrder =
          JSON.parse(savedOrder);


        console.log(
          "📦 Order loaded from localStorage:",
          parsedOrder
        );


        setOrder(
          parsedOrder
        );

      } catch (error) {

        console.error(
          "❌ Invalid saved order:",
          error
        );


        localStorage.removeItem(
          "lastOrder"
        );

      }

    }


    setLoading(false);

  }, [location.state]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="order-confirm-page">

        <div className="order-card">

          <div className="success-icon">
            ⏳
          </div>

          <h1>
            Loading Order...
          </h1>

          <p>
            Please wait while we load
            your order details.
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // NO ORDER
  // =====================================================

  if (!order) {

    return (
      <Navigate
        to="/checkout"
        replace
      />
    );
  }


  // =====================================================
  // BACKEND ORDER ID
  // =====================================================

  const orderNumber =
    order.orderId ||
    order._id ||
    "N/A";


  // =====================================================
  // ORDER STATUS
  // =====================================================

  const orderStatus =
    order.orderStatus ||
    "placed";


  // =====================================================
  // PAYMENT METHOD
  // =====================================================

  const paymentMethod =
    order.paymentMethod === "cod"
      ? "Cash on Delivery"
      : order.paymentMethod === "online"
      ? "Online Payment"
      : order.paymentMethod || "N/A";


  // =====================================================
  // PAYMENT STATUS
  // =====================================================

  const paymentStatus =
    order.paymentStatus ||
    "pending";


  // =====================================================
  // TOTAL
  // =====================================================

  const total =
    Number(
      order.total || 0
    );


  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal =
    Number(
      order.subtotal || 0
    );


  // =====================================================
  // SHIPPING
  // =====================================================

  const shipping =
    Number(
      order.shipping || 0
    );


  // =====================================================
  // DATE
  // =====================================================

  const orderDate =
    order.createdAt
      ? new Date(
          order.createdAt
        ).toLocaleString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "Just now";


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="order-confirm-page">

      <div className="order-card">


        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        <div className="success-icon">
          🎉
        </div>


        <h1>
          Order Placed Successfully!
        </h1>


        <p className="thank-you-text">

          Thank you for shopping with{" "}

          <b>
            Dhanvi Fashion & Gifts
          </b>

          .

        </p>


        {/* ================================================= */}
        {/* ORDER ID */}
        {/* ================================================= */}

        <div className="order-id-section">

          <p className="order-label">
            Your Order ID
          </p>


          <h2 className="order-id">
            #{orderNumber}
          </h2>

        </div>


        {/* ================================================= */}
        {/* ORDER DETAILS */}
        {/* ================================================= */}

        <div className="order-info">


          {/* STATUS */}

          <div className="order-info-row">

            <span>
              Order Status
            </span>

            <strong
              className="status-success"
            >
              {orderStatus
                .charAt(0)
                .toUpperCase() +
                orderStatus.slice(1)}
            </strong>

          </div>


          {/* PAYMENT */}

          <div className="order-info-row">

            <span>
              Payment Method
            </span>

            <strong>
              {paymentMethod}
            </strong>

          </div>


          {/* PAYMENT STATUS */}

          <div className="order-info-row">

            <span>
              Payment Status
            </span>

            <strong>
              {paymentStatus
                .charAt(0)
                .toUpperCase() +
                paymentStatus.slice(1)}
            </strong>

          </div>


          {/* DATE */}

          <div className="order-info-row">

            <span>
              Order Date
            </span>

            <strong>
              {orderDate}
            </strong>

          </div>


          {/* ITEMS */}

          <div className="order-info-row">

            <span>
              Items
            </span>

            <strong>
              {order.items?.length || 0}
            </strong>

          </div>


        </div>


        {/* ================================================= */}
        {/* PRICE SUMMARY */}
        {/* ================================================= */}

        <div className="order-price-summary">


          <div className="price-row">

            <span>
              Subtotal
            </span>

            <strong>
              ₹
              {subtotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>


          <div className="price-row">

            <span>
              Shipping
            </span>

            <strong
              className={
                shipping === 0
                  ? "free"
                  : ""
              }
            >

              {shipping === 0
                ? "FREE"
                : `₹${shipping.toLocaleString(
                    "en-IN"
                  )}`}

            </strong>

          </div>


          <div className="price-row total-row">

            <span>
              Total
            </span>

            <strong>
              ₹
              {total.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>


        </div>


        {/* ================================================= */}
        {/* MESSAGE */}
        {/* ================================================= */}

        <div className="order-message">

          <span>
            📦
          </span>

          <p>
            Your order has been confirmed
            and will be shipped soon.
          </p>

        </div>


        {/* ================================================= */}
        {/* BUTTONS */}
        {/* ================================================= */}

        <div className="order-buttons">


          <Link to="/">

            <button
              className="home-btn"
            >
              Continue Shopping
            </button>

          </Link>


          <Link to="/myorders">

            <button
              className="orders-btn"
            >
              View Orders
            </button>

          </Link>


        </div>


      </div>

    </div>

  );
}


export default OrderConfirmation;