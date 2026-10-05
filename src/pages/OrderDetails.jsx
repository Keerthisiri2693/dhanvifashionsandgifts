import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById } from "../api/orderApi";
import "./OrderDetails.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://dhanvifashionbackend.onrender.com/api";

const SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, "");

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD ORDER
  // =====================================================

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("📦 Loading order:", orderId);

        const data = await getOrderById(orderId);

        console.log("✅ ORDER DETAILS:", data);

        if (!data) {
          throw new Error("Order not found");
        }

        setOrder(data);
      } catch (err) {
        console.error(
          "❌ ORDER DETAILS ERROR:",
          err
        );

        setError(
          err.message ||
            "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    } else {
      setError("Order ID is missing");
      setLoading(false);
    }
  }, [orderId]);

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (value) => {
    return Number(value || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${SERVER_URL}${image}`;
    }

    return `${SERVER_URL}/${image}`;
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    return String(status || "placed")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-details-loading">
          <div className="order-loading-spinner"></div>

          <h3>
            Loading order details...
          </h3>

          <p>
            Please wait while we fetch your order.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !order) {
    return (
      <div className="order-details-page">
        <div className="order-details-error">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Order Not Found
          </h2>

          <p>
            {error ||
              "Unable to find this order."}
          </p>

          <Link
            to="/myorders"
            className="back-orders-btn"
          >
            ← Back to My Orders
          </Link>

        </div>
      </div>
    );
  }

  const orderNumber =
    order.orderId || order._id;

  const paymentMethod =
    order.paymentMethod === "cod"
      ? "Cash on Delivery"
      : "Online Payment";

  const orderStatus =
    order.orderStatus || "placed";

  const paymentStatus =
    order.paymentStatus || "pending";

  return (
    <div className="order-details-page">

      <div className="order-details-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="order-details-header">

          <div className="order-header-left">

            <span className="order-header-label">
              ORDER DETAILS
            </span>

            <h1>
              Order #{orderNumber}
            </h1>

            <p>
              Placed on{" "}
              {formatDate(order.createdAt)}
            </p>

          </div>

          <Link
            to="/myorders"
            className="back-myorders-link"
          >
            ← My Orders
          </Link>

        </div>

        {/* =================================================
            STATUS CARD
        ================================================= */}

        <div className="order-status-card">

          <div className="status-info">

            <div className="status-icon">
              📦
            </div>

            <div>
              <span>
                Order Status
              </span>

              <strong
                className={`status-value ${getStatusClass(
                  orderStatus
                )}`}
              >
                {orderStatus}
              </strong>
            </div>

          </div>

          <div className="status-divider"></div>

          <div className="status-info">

            <div className="status-icon">
              💳
            </div>

            <div>
              <span>
                Payment
              </span>

              <strong>
                {paymentMethod}
              </strong>
            </div>

          </div>

          <div className="status-divider"></div>

          <div className="status-info">

            <div className="status-icon">
              ✓
            </div>

            <div>
              <span>
                Payment Status
              </span>

              <strong
                className={`payment-status ${getStatusClass(
                  paymentStatus
                )}`}
              >
                {paymentStatus}
              </strong>
            </div>

          </div>

        </div>

        {/* =================================================
            ORDERED ITEMS
        ================================================= */}

        <div className="order-details-card">

          <div className="card-title-row">

            <div>
              <h2>
                Ordered Items
              </h2>

              <p>
                {order.items?.length || 0}{" "}
                {order.items?.length === 1
                  ? "item"
                  : "items"}{" "}
                in this order
              </p>
            </div>

          </div>

          <div className="order-details-products">

            {order.items?.length > 0 ? (
              order.items.map(
                (item, index) => {

                  const imageUrl =
                    getImageUrl(
                      item.image
                    );

                  const price =
                    Number(
                      item.price || 0
                    );

                  const quantity =
                    Number(
                      item.quantity || 0
                    );

                  const itemTotal =
                    Number(
                      item.itemTotal ??
                        price * quantity
                    );

                  return (
                    <div
                      className="order-detail-product"
                      key={
                        item.productId ||
                        index
                      }
                    >

                      {/* IMAGE */}

                      <div className="order-detail-image">

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              item.name ||
                              "Product"
                            }
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";

                              const fallback =
                                e.currentTarget
                                  .parentElement
                                  .querySelector(
                                    ".product-image-fallback"
                                  );

                              if (fallback) {
                                fallback.style.display =
                                  "flex";
                              }
                            }}
                          />
                        ) : null}

                        <span
                          className="product-image-fallback"
                          style={{
                            display: imageUrl
                              ? "none"
                              : "flex",
                          }}
                        >
                          🎁
                        </span>

                        <span className="detail-quantity">
                          {quantity}
                        </span>

                      </div>

                      {/* DETAILS */}

                      <div className="order-detail-info">

                        <h3>
                          {item.name ||
                            "Product"}
                        </h3>

                        {item.category && (
                          <p className="detail-category">
                            {item.category}
                          </p>
                        )}

                        <span className="detail-price">

                          ₹
                          {formatPrice(
                            price
                          )}

                          <span className="multiply">
                            ×
                          </span>

                          {quantity}

                        </span>

                      </div>

                      {/* TOTAL */}

                      <div className="order-item-total">

                        <span>
                          Item Total
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            itemTotal
                          )}
                        </strong>

                      </div>

                    </div>
                  );
                }
              )
            ) : (
              <div className="empty-order-items">
                No items found in this order.
              </div>
            )}

          </div>

        </div>

        {/* =================================================
            ADDRESS + PRICE
        ================================================= */}

        <div className="order-details-grid">

          {/* DELIVERY ADDRESS */}

          <div className="order-details-card">

            <div className="card-title-row">

              <div>
                <h2>
                  Delivery Address
                </h2>

                <p>
                  Your shipping information
                </p>
              </div>

              <div className="card-heading-icon">
                📍
              </div>

            </div>

            <div className="address-details">

              <strong>
                {
                  order.shippingAddress
                    ?.name
                }
              </strong>

              <p>
                {
                  order.shippingAddress
                    ?.address
                }
              </p>

              <p>
                {
                  order.shippingAddress
                    ?.city
                }
                {order.shippingAddress
                  ?.city &&
                order.shippingAddress
                  ?.state
                  ? ", "
                  : ""}
                {
                  order.shippingAddress
                    ?.state
                }
              </p>

              <p>
                PIN:{" "}
                {
                  order.shippingAddress
                    ?.pincode
                }
              </p>

              <p>
                Phone:{" "}
                {
                  order.shippingAddress
                    ?.phone
                }
              </p>

              {order.shippingAddress
                ?.email && (
                <p>
                  Email:{" "}
                  {
                    order.shippingAddress
                      .email
                  }
                </p>
              )}

            </div>

          </div>

          {/* PRICE DETAILS */}

          <div className="order-details-card">

            <div className="card-title-row">

              <div>
                <h2>
                  Price Details
                </h2>

                <p>
                  Complete payment summary
                </p>
              </div>

              <div className="card-heading-icon">
                💰
              </div>

            </div>

            <div className="price-details">

              <div className="price-detail-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {formatPrice(
                    order.subtotal
                  )}
                </strong>

              </div>

              <div className="price-detail-row">

                <span>
                  Shipping
                </span>

                <strong
                  className={
                    Number(
                      order.shipping || 0
                    ) === 0
                      ? "free-shipping"
                      : ""
                  }
                >
                  {Number(
                    order.shipping || 0
                  ) === 0
                    ? "FREE"
                    : `₹${formatPrice(
                        order.shipping
                      )}`}
                </strong>

              </div>

              <div className="price-detail-total">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹
                  {formatPrice(
                    order.total
                  )}
                </strong>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="order-details-actions">

          <button
            type="button"
            className="track-order-btn"
            onClick={() =>
              navigate(
                `/trackorders/${order.orderId}`
              )
            }
          >
            🚚
            <span>
              Track Order
            </span>
          </button>

          <Link
            to="/myorders"
            className="back-orders-action"
          >
            ← Back to Orders
          </Link>

        </div>

      </div>

    </div>
  );
}

export default OrderDetails;