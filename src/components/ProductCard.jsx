import { useState } from "react";
import "./ProductCard.css";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://dhanvifashionbackend.onrender.com/api";


// =====================================================
// CART ID
// =====================================================

const getCartId = () => {
  const key = "dhanvi_cart_id";

  let cartId = localStorage.getItem(key);

  if (!cartId) {
    cartId =
      "cart_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .substring(2, 10);

    localStorage.setItem(key, cartId);
  }

  return cartId;
};


function ProductCard({
  product,
  addToCart,
}) {
  const [favorite, setFavorite] =
    useState(false);

  const [imageError, setImageError] =
    useState(false);

  const [adding, setAdding] =
    useState(false);

  if (!product) {
    return null;
  }


  // =====================================================
  // PRODUCT ID
  // =====================================================

  const productId =
    product._id ||
    product.id;


  // =====================================================
  // IMAGE
  // =====================================================

  const getImageUrl = () => {
    let image = "";

    if (product.image) {
      image = product.image;
    } else if (product.imageUrl) {
      image = product.imageUrl;
    } else if (
      product.images?.length > 0
    ) {
      image = product.images[0];
    } else if (
      product.photos?.length > 0
    ) {
      image = product.photos[0];
    }

    if (!image) {
      return "";
    }

    // Complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    const SERVER_URL =
      API_URL.replace("/api", "");

    // /uploads/image.jpg
    if (image.startsWith("/")) {
      return `${SERVER_URL}${image}`;
    }

    // uploads/image.jpg
    return `${SERVER_URL}/${image}`;
  };


  const imageUrl =
    getImageUrl();


  // =====================================================
  // PRODUCT VALUES
  // =====================================================

  const productName =
    product.name ||
    product.productName ||
    "Product";


  const category =
    product.category || "";


  const subCategory =
    product.subCategory ||
    product.subcategory ||
    "";


  const description =
    product.description || "";


  const price = Number(
    product.price || 0
  );


  const originalPrice =
    Number(
      product.originalPrice ||
      product.mrp ||
      product.oldPrice ||
      0
    );


  const stock =
    Number(
      product.stock ??
      product.quantity ??
      0
    );


  // =====================================================
  // DISCOUNT
  // =====================================================

  const discount =
    originalPrice > price &&
    price > 0
      ? Math.round(
          ((originalPrice - price) /
            originalPrice) *
            100
        )
      : 0;


  // =====================================================
  // STOCK STATUS
  // =====================================================

  const isOutOfStock =
    stock <= 0;


  const isLowStock =
    stock > 0 &&
    stock <= 5;


  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async () => {
  if (isOutOfStock || adding || !productId) {
    return;
  }

  try {
    setAdding(true);

    // =====================================================
    // CART ID
    // =====================================================

    const cartId = getCartId();

    // =====================================================
    // USER ID
    // =====================================================

    let userId = localStorage.getItem("userId");

    // Temporary test user
    // Remove this once login is implemented
    if (!userId) {
   

      localStorage.setItem(
        "userId",
        userId
      );
    }

    console.log("🛒 Adding product:", productId);
    console.log("🛒 Cart ID:", cartId);
    console.log("👤 User ID:", userId);

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!cartId) {
      throw new Error("Cart ID not found");
    }

    if (!userId) {
      throw new Error(
        "User ID not found. Please login first."
      );
    }

    if (!productId) {
      throw new Error("Product ID not found");
    }

    // =====================================================
    // API REQUEST
    // =====================================================

    const response = await fetch(
      `${API_URL}/cart/add`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          cartId: cartId,
          userId: userId,
          productId: productId,
          quantity: 1,
        }),
      }
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    const data = await response.json();

    console.log("🛒 Cart response:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Unable to add product to cart"
      );
    }

    // =====================================================
    // SUCCESS
    // =====================================================

    console.log(
      "✅ Product added to cart successfully"
    );

    console.log(
      "🛒 Updated cart:",
      data.cart
    );

    // Update parent state
    if (typeof addToCart === "function") {
      addToCart(data.cart);
    }

  } catch (error) {

    console.error(
      "❌ Add to cart error:",
      error
    );

    alert(
      error.message ||
        "Unable to add product to cart"
    );

  } finally {

    setAdding(false);

  }
};

  // =====================================================
  // CATEGORY FORMAT
  // =====================================================

  const formatText =
    (value) => {

      if (!value) {
        return "";
      }

      return String(value)
        .split("-")
        .filter(Boolean)
        .map(
          (word) =>
            word
              .charAt(0)
              .toUpperCase() +
            word.slice(1)
        )
        .join(" ");
    };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <article
      className="product-card"
    >

      {/* =================================================
          IMAGE
      ================================================= */}

      <div
        className={`product-image-wrapper ${
          !imageUrl ||
          imageError
            ? "no-image"
            : ""
        }`}
      >

        {!imageError &&
        imageUrl ? (

          <img
            src={imageUrl}
            alt={productName}
            className="product-image"

            onError={() => {

              console.error(
                "❌ PRODUCT IMAGE FAILED:",
                imageUrl
              );

              setImageError(true);

            }}
          />

        ) : (

          <div className="no-image-content">

            <span className="no-image-icon">
              🛍️
            </span>

            <span className="no-image-text">
              No Image
            </span>

          </div>

        )}


        {/* =================================================
            DISCOUNT
        ================================================= */}

        {discount > 0 && (

          <span
            className="discount-badge"
          >
            {discount}% OFF
          </span>

        )}


        {/* =================================================
            FAVORITE
        ================================================= */}

        <button
          type="button"

          className={`favorite-button ${
            favorite
              ? "active"
              : ""
          }`}

          onClick={() =>
            setFavorite(
              (value) => !value
            )
          }

          aria-label={
            favorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >

          <FaHeart
            size={17}
          />

        </button>


        {/* =================================================
            OUT OF STOCK
        ================================================= */}

        {isOutOfStock && (

          <div
            className="out-of-stock-overlay"
          >

            <span>
              Out of Stock
            </span>

          </div>

        )}

      </div>


      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="product-content"
      >

        {/* CATEGORY */}

        {category && (

          <span
            className="product-category"
          >
            {formatText(category)}
          </span>

        )}


        {/* SUBCATEGORY */}

        {subCategory && (

          <div
            className="product-subcategory"
          >
            {formatText(subCategory)}
          </div>

        )}


        {/* PRODUCT NAME */}

        <h3
          className="product-name"
        >
          {productName}
        </h3>


        {/* DESCRIPTION */}

        {description && (

          <p
            className="product-description"
          >
            {description}
          </p>

        )}


        {/* PRICE */}

        <div
          className="product-price-row"
        >

          <span
            className="product-price"
          >
            ₹
            {price.toLocaleString(
              "en-IN"
            )}
          </span>


          {originalPrice > price && (

            <span
              className="product-original-price"
            >
              ₹
              {originalPrice.toLocaleString(
                "en-IN"
              )}
            </span>

          )}

        </div>


        {/* STOCK */}

        {!isOutOfStock && (

          <div
            className={`stock-text ${
              isLowStock
                ? "low-stock"
                : ""
            }`}
          >

            {isLowStock
              ? `Only ${stock} left`
              : "In Stock"}

          </div>

        )}


        {/* ADD CART */}

        <button
          type="button"

          className="add-cart-button"

          disabled={
            isOutOfStock ||
            adding
          }

          onClick={
            handleAddToCart
          }
        >

          {isOutOfStock ? (

            "Out of Stock"

          ) : adding ? (

            <>
              <span>
                Adding...
              </span>
            </>

          ) : (

            <>
              <FaShoppingCart
                size={15}
              />

              <span>
                Add to Cart
              </span>
            </>

          )}

        </button>

      </div>

    </article>
  );
}

export default ProductCard;