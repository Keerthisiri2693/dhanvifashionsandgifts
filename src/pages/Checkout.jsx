import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCart } from "../api/cartApi";
import {
  createOrder,
  isUserLoggedIn,
  getUserId,
} from "../api/orderApi";

import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState("");

  const [loadingCart, setLoadingCart] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "cod",
  });

  // =====================================================
  // LOAD CART
  // =====================================================

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoadingCart(true);
      setError("");

      const response = await getCart();

      console.log("🛒 CHECKOUT CART RESPONSE:", response);

      // -------------------------------------------------
      // HANDLE DIFFERENT API RESPONSE STRUCTURES
      // -------------------------------------------------

      const cart = response?.cart || response;

      const items =
        response?.items ||
        cart?.items ||
        [];

      const currentCartId =
        cart?.cartId ||
        response?.cartId ||
        localStorage.getItem("cartId") ||
        "";

      console.log("🛒 CART OBJECT:", cart);
      console.log("🆔 CART ID:", currentCartId);
      console.log("📦 CART ITEMS:", items);

      // -------------------------------------------------
      // SAVE CART ID
      // -------------------------------------------------

      if (currentCartId) {
        setCartId(currentCartId);

        localStorage.setItem(
          "cartId",
          currentCartId
        );
      }

      setCartItems(items);

      // -------------------------------------------------
      // EMPTY CART
      // -------------------------------------------------

      if (items.length === 0) {
        setError("Your cart is empty.");
      }

      // -------------------------------------------------
      // CART ID MISSING
      // -------------------------------------------------

      if (!currentCartId) {
        console.error(
          "❌ Cart ID missing from API response"
        );

        setError(
          "Unable to identify your cart. Please return to cart and try again."
        );
      }
    } catch (error) {
      console.error(
        "❌ CHECKOUT CART ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to load your cart"
      );

      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // TOTAL ITEMS
  // =====================================================

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );
  }, [cartItems]);

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        const price = Number(
          item.price || 0
        );

        const quantity = Number(
          item.quantity || 0
        );

        return total + price * quantity;
      },
      0
    );
  }, [cartItems]);

  // =====================================================
  // SHIPPING
  // =====================================================

  const shipping = useMemo(() => {
    return subtotal >= 1000 ? 0 : 50;
  }, [subtotal]);

  // =====================================================
  // GRAND TOTAL
  // =====================================================

  const grandTotal = useMemo(() => {
    return subtotal + shipping;
  }, [subtotal, shipping]);

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please enter your full name.");
      return false;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email address.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (!formData.phone.trim()) {
      alert("Please enter your phone number.");
      return false;
    }

    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (
      !phoneRegex.test(
        formData.phone.trim()
      )
    ) {
      alert(
        "Please enter a valid 10-digit phone number."
      );
      return false;
    }

    if (!formData.address.trim()) {
      alert("Please enter your delivery address.");
      return false;
    }

    if (!formData.city.trim()) {
      alert("Please enter your city.");
      return false;
    }

    if (!formData.state.trim()) {
      alert("Please enter your state.");
      return false;
    }

    if (!formData.pincode.trim()) {
      alert("Please enter your pincode.");
      return false;
    }

    const pincodeRegex =
      /^\d{6}$/;

    if (
      !pincodeRegex.test(
        formData.pincode.trim()
      )
    ) {
      alert(
        "Please enter a valid 6-digit pincode."
      );
      return false;
    }

    if (
      !["cod", "online"].includes(
        formData.payment
      )
    ) {
      alert("Please select a payment method.");
      return false;
    }

    return true;
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("=================================");
  console.log("🛒 PLACE ORDER CLICKED");
  console.log("=================================");

  // =================================================
  // 1. CHECK LOGIN FIRST
  // =================================================

  const storedUserId =
    localStorage.getItem("userId");

  const userId =
    storedUserId?.trim();

  console.log("👤 USER ID:", userId);

  // -------------------------------------------------
  // USER IS NOT LOGGED IN
  // -------------------------------------------------

  if (
    !userId ||
    userId === "1" ||
    userId === "null" ||
    userId === "undefined"
  ) {
    console.log(
      "❌ USER NOT LOGGED IN"
    );

    // Remove invalid old value
    localStorage.removeItem("userId");

    alert(
      "Please login before placing your order."
    );

    navigate("/login", {
      state: {
        from: "/checkout",
        message:
          "Please login to place your order.",
      },
    });

    return;
  }

  console.log(
    "✅ USER IS LOGGED IN:",
    userId
  );

  // =================================================
  // 2. CHECK CART
  // =================================================

  if (
    !cartItems ||
    cartItems.length === 0
  ) {
    console.log(
      "❌ CART IS EMPTY"
    );

    alert(
      "Your cart is empty."
    );

    return;
  }

  // =================================================
  // 3. GET CART ID
  // =================================================

  const finalCartId =
    cartId ||
    localStorage.getItem("cartId") ||
    "";

  console.log(
    "🛒 CART ID:",
    finalCartId
  );

  if (!finalCartId) {
    console.error(
      "❌ CART ID NOT FOUND"
    );

    alert(
      "Cart ID not found. Please return to cart and try again."
    );

    return;
  }

  // =================================================
  // 4. VALIDATE FORM
  // =================================================

  if (!validateForm()) {
    console.log(
      "❌ FORM VALIDATION FAILED"
    );

    return;
  }

  // =================================================
  // 5. START ORDER
  // =================================================

  try {
    setPlacingOrder(true);
    setError("");

    // =================================================
    // 6. SHIPPING ADDRESS
    // =================================================

    const shippingAddress = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pincode: formData.pincode.trim(),
    };

    console.log("=================================");
    console.log("📦 CREATING ORDER");
    console.log("👤 USER ID:", userId);
    console.log("🛒 CART ID:", finalCartId);
    console.log("📍 SHIPPING:", shippingAddress);
    console.log("💳 PAYMENT:", formData.payment);
    console.log("=================================");

    // =================================================
    // 7. CREATE ORDER
    // =================================================

    const order = await createOrder({
      cartId: finalCartId,

      shippingAddress,

      paymentMethod: formData.payment,
    });

    console.log(
      "================================="
    );

    console.log(
      "✅ ORDER CREATED SUCCESSFULLY"
    );

    console.log(
      "🧾 ORDER:",
      order
    );

    console.log(
      "================================="
    );

    // =================================================
    // 8. SAVE ORDER
    // =================================================

    localStorage.setItem(
      "pendingOrder",
      JSON.stringify(order)
    );

    // =================================================
    // 9. REMOVE CART ID
    // =================================================

    localStorage.removeItem(
      "cartId"
    );

    // =================================================
    // 10. GO TO ORDER CONFIRMATION
    // =================================================

    navigate(
      "/orderconfirmation",
      {
        state: {
          order,
        },
      }
    );

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "❌ PLACE ORDER ERROR:",
      error
    );

    console.error(
      "================================="
    );

    setError(
      error.message ||
        "Unable to place order"
    );

    alert(
      error.message ||
        "Unable to place order"
    );

  } finally {

    setPlacingOrder(false);

  }
};

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingCart) {
    return (
      <div className="checkout-page">
        <div className="checkout-loading">

          <div className="checkout-spinner"></div>

          <h2>
            Loading checkout...
          </h2>

          <p>
            Please wait while we prepare
            your order.
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">

        <div className="checkout-empty">

          <div className="checkout-empty-icon">
            🛒
          </div>

          <h1>
            Your cart is empty
          </h1>

          <p>
            Add some products before
            proceeding to checkout.
          </p>

          <button
            className="back-shop-btn"
            onClick={() =>
              navigate("/shop")
            }
          >
            Continue Shopping
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="checkout-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="checkout-header">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate("/cart")
          }
        >
          ← Back to Cart
        </button>

        <h1>
          Checkout
        </h1>

        <p>
          Complete your order securely
        </p>

      </div>

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="checkout-container">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="checkout-left">

          {/* =================================================
              SHIPPING DETAILS
          ================================================= */}

          <div className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-number">
                1
              </div>

              <div>
                <h2>
                  Shipping Details
                </h2>

                <p>
                  Where should we deliver
                  your order?
                </p>
              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              id="checkout-form"
            >

              {/* NAME */}

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />

              </div>

              {/* EMAIL + PHONE */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel"
                  />

                </div>

              </div>

              {/* ADDRESS */}

              <div className="form-group">

                <label>
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  placeholder="House / Flat / Street / Area"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  autoComplete="street-address"
                />

              </div>

              {/* CITY STATE PINCODE */}

              <div className="form-row three-columns">

                <div className="form-group">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    autoComplete="address-level2"
                  />

                </div>

                <div className="form-group">

                  <label>
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    autoComplete="address-level1"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    placeholder="6-digit pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="postal-code"
                  />

                </div>

              </div>

            </form>

          </div>

          {/* =================================================
              PAYMENT
          ================================================= */}

          <div className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-number">
                2
              </div>

              <div>
                <h2>
                  Payment Method
                </h2>

                <p>
                  Choose your preferred
                  payment option
                </p>
              </div>

            </div>

            <div className="payment-options">

              {/* COD */}

              <label
                className={`payment-card ${
                  formData.payment === "cod"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={
                    formData.payment === "cod"
                  }
                  onChange={handleChange}
                />

                <div className="payment-icon">
                  💵
                </div>

                <div className="payment-content">

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order
                    arrives
                  </span>

                </div>

                {formData.payment === "cod" && (
                  <div className="payment-check">
                    ✓
                  </div>
                )}

              </label>

              {/* ONLINE */}

              <label
                className={`payment-card ${
                  formData.payment === "online"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={
                    formData.payment === "online"
                  }
                  onChange={handleChange}
                />

                <div className="payment-icon">
                  💳
                </div>

                <div className="payment-content">

                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    UPI / Card / Net Banking
                  </span>

                </div>

                {formData.payment === "online" && (
                  <div className="payment-check">
                    ✓
                  </div>
                )}

              </label>

            </div>

          </div>

        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="checkout-right">

          <div className="order-summary-card">

            {/* HEADER */}

            <div className="summary-header">

              <div>

                <h2>
                  Order Summary
                </h2>

                <span>
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "items"}
                </span>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/cart")
                }
                className="edit-cart-btn"
              >
                Edit
              </button>

            </div>

            {/* PRODUCTS */}

            <div className="checkout-products">

              {cartItems.map((item) => {

                const imageUrl =
                  item.image?.startsWith(
                    "http"
                  )
                    ? item.image
                    : item.image
                    ? `https://dhanvifashionbackend.onrender.com${item.image}`
                    : "";

                const itemTotal =
                  Number(
                    item.price || 0
                  ) *
                  Number(
                    item.quantity || 0
                  );

                return (
                  <div
                    className="checkout-product"
                    key={
                      item.productId ||
                      item._id
                    }
                  >

                    <div className="checkout-product-image">

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={
                            item.name
                          }
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <span>
                          🎁
                        </span>
                      )}

                      <span className="product-quantity">
                        {item.quantity}
                      </span>

                    </div>

                    <div className="checkout-product-info">

                      <h3>
                        {item.name}
                      </h3>

                      {item.category && (
                        <p>
                          {item.category}
                        </p>
                      )}

                      <span>
                        ₹
                        {formatPrice(
                          item.price
                        )}{" "}
                        ×{" "}
                        {item.quantity}
                      </span>

                    </div>

                    <strong>
                      ₹
                      {formatPrice(
                        itemTotal
                      )}
                    </strong>

                  </div>
                );
              })}

            </div>

            {/* PRICE DETAILS */}

            <div className="price-details">

              <div className="price-row">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {formatPrice(
                    subtotal
                  )}
                </span>

              </div>

              <div className="price-row">

                <span>
                  Shipping
                </span>

                <span
                  className={
                    shipping === 0
                      ? "free"
                      : ""
                  }
                >
                  {shipping === 0
                    ? "FREE"
                    : `₹${formatPrice(
                        shipping
                      )}`}
                </span>

              </div>

              {subtotal < 1000 && (
                <div className="shipping-note">
                  Add ₹
                  {formatPrice(
                    1000 - subtotal
                  )}{" "}
                  more for FREE delivery
                </div>
              )}

            </div>

            {/* TOTAL */}

            <div className="grand-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {formatPrice(
                  grandTotal
                )}
              </strong>

            </div>

            {/* PLACE ORDER */}

            <button
              type="submit"
              form="checkout-form"
              className="place-order-btn"
              disabled={
                placingOrder ||
                !cartId
              }
            >
              {placingOrder ? (
                <>
                  <span className="button-spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  Place Order
                  <span>→</span>
                </>
              )}
            </button>

            {/* SECURITY */}

            <div className="checkout-security">

              <span>
                🔒
              </span>

              <div>

                <strong>
                  Secure Checkout
                </strong>

                <p>
                  Your information is
                  protected
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;