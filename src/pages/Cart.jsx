import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCart,
  updateCartQuantity,
  removeCartItem,
} from "../api/cartApi";

import "./Cart.css";

const IMAGE_BASE_URL = "https://dhanvifashionbackend.onrender.com";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD CART
  // =====================================================

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const cart = await getCart();

      console.log("🛒 CART:", cart);

      setCartItems(cart?.items || []);
    } catch (error) {
      console.error("❌ LOAD CART:", error);

      setError(
        error.message ||
          "Failed to load cart"
      );

      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${IMAGE_BASE_URL}${image}`;
  };

  // =====================================================
  // INCREASE
  // =====================================================

  const increaseQty = async (item) => {
    try {
      const quantity =
        Number(item.quantity) + 1;

      const cart =
        await updateCartQuantity(
          item.productId,
          quantity
        );

      setCartItems(
        cart?.items || []
      );
    } catch (error) {
      alert(
        error.message ||
          "Unable to update quantity"
      );
    }
  };

  // =====================================================
  // DECREASE
  // =====================================================

  const decreaseQty = async (item) => {
    if (Number(item.quantity) <= 1) {
      return;
    }

    try {
      const quantity =
        Number(item.quantity) - 1;

      const cart =
        await updateCartQuantity(
          item.productId,
          quantity
        );

      setCartItems(
        cart?.items || []
      );
    } catch (error) {
      alert(
        error.message ||
          "Unable to update quantity"
      );
    }
  };

  // =====================================================
  // REMOVE
  // =====================================================

  const removeItem = async (productId) => {
    try {
      const cart =
        await removeCartItem(
          productId
        );

      setCartItems(
        cart?.items || []
      );
    } catch (error) {
      alert(
        error.message ||
          "Unable to remove item"
      );
    }
  };

  // =====================================================
  // TOTALS
  // =====================================================

  const totalItems =
    cartItems.reduce(
      (sum, item) =>
        sum +
        Number(item.quantity || 0),
      0
    );

  const subtotal =
    cartItems.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );

  const delivery = 0;

  const total =
    subtotal + delivery;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-loading">
          <div className="cart-spinner" />
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="cart-page">
        <div className="cart-error">
          <div className="cart-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to load cart
          </h2>

          <p>{error}</p>

          <button
            onClick={loadCart}
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h1>
            Your cart is empty
          </h1>

          <p>
            Looks like you haven't
            added anything yet.
          </p>

          <Link
            to="/shop"
            className="continue-btn"
          >
            Continue Shopping
          </Link>

        </div>
      </div>
    );
  }

  // =====================================================
  // CART
  // =====================================================

  return (
    <div className="cart-page">

      <div className="cart-wrapper">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="cart-title-section">

          <div>
            <h1>
              Your Cart
              <span> 🛒</span>
            </h1>

            <p>
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}{" "}
              in your shopping bag
            </p>
          </div>

          <Link
            to="/shop"
            className="back-shop"
          >
            ← Continue Shopping
          </Link>

        </div>

        {/* =================================================
            MAIN
        ================================================= */}

        <div className="cart-layout">

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div className="cart-products">

            <div className="cart-products-header">
              <span>
                Shopping Bag
              </span>

              <span>
                {cartItems.length} products
              </span>
            </div>

            {cartItems.map((item) => {

              const imageUrl =
                getImageUrl(
                  item.image
                );

              const itemTotal =
                Number(item.price || 0) *
                Number(item.quantity || 0);

              return (
                <div
                  key={item.productId}
                  className="cart-product"
                >

                  {/* IMAGE */}

                  <div className="cart-product-image">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="no-image">
                        🛍️
                      </div>
                    )}

                  </div>

                  {/* DETAILS */}

                  <div className="cart-product-info">

                    <span className="product-category">
                      {item.category ||
                        "Gift"}
                    </span>

                    <h2>
                      {item.name}
                    </h2>

                    {item.subCategory && (
                      <p className="product-subcategory">
                        {item.subCategory}
                      </p>
                    )}

                    <div className="product-price">

                      <strong>
                        ₹
                        {Number(
                          item.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      {Number(
                        item.originalPrice
                      ) >
                        Number(item.price) && (
                        <del>
                          ₹
                          {Number(
                            item.originalPrice
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </del>
                      )}

                    </div>

                    <button
                      className="remove-product"
                      onClick={() =>
                        removeItem(
                          item.productId
                        )
                      }
                    >
                      🗑 Remove
                    </button>

                  </div>

                  {/* QUANTITY */}

                  <div className="cart-product-quantity">

                    <span>
                      Quantity
                    </span>

                    <div className="quantity-control">

                      <button
                        onClick={() =>
                          decreaseQty(item)
                        }
                        disabled={
                          Number(
                            item.quantity
                          ) <= 1
                        }
                      >
                        −
                      </button>

                      <strong>
                        {item.quantity}
                      </strong>

                      <button
                        onClick={() =>
                          increaseQty(item)
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* TOTAL */}

                  <div className="cart-product-total">

                    <span>
                      Item Total
                    </span>

                    <strong>
                      ₹
                      {itemTotal.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                </div>
              );
            })}
          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <aside className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-items">
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}
            </div>

            <div className="summary-line">
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

            <div className="summary-line">
              <span>
                Delivery
              </span>

              <strong className="free">
                FREE
              </strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
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

            <Link
              to="/checkout"
              className="checkout-btn"
            >
              Proceed to Checkout
              <span>→</span>
            </Link>

            <div className="secure-checkout">
              🔒 Secure checkout
            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}

export default Cart;