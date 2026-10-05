import React from "react";
import "./ProductCard.css";

function ProductCard({ product, addToCart }) {
  if (!product) {
    return null;
  }

  const productName =
    product.name ||
    product.productName ||
    "Product";

  const price = Number(product.price) || 0;

  const originalPrice =
    Number(product.originalPrice) || 0;

  const image =
    product.image ||
    product.images?.[0] ||
    product.imageUrl ||
    "";

  const stock =
    Number(product.stock) || 0;

  const category =
    product.category || "";

  const subCategory =
    product.subCategory || "";

  const description =
    product.description || "";

  const discount =
    originalPrice > price && originalPrice > 0
      ? Math.round(
          ((originalPrice - price) /
            originalPrice) *
            100
        )
      : 0;


  const handleAddToCart = () => {
    if (
      typeof addToCart === "function" &&
      stock > 0
    ) {
      addToCart(product);
    }
  };


  return (
    <article className="product-card">

      {/* =================================================
          IMAGE
      ================================================= */}

      <div className="product-image-wrapper">

        {image ? (
          <img
            src={image}
            alt={productName}
            className="product-image"
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder">
            🛍️
          </div>
        )}


        {/* DISCOUNT */}

        {discount > 0 && (
          <span className="discount-badge">
            {discount}% OFF
          </span>
        )}


        {/* FAVORITE */}

        <button
          type="button"
          className="favorite-button"
          aria-label="Add to wishlist"
        >
          ♡
        </button>


        {/* OUT OF STOCK */}

        {stock <= 0 && (
          <div className="out-of-stock-overlay">
            <span>
              Out of Stock
            </span>
          </div>
        )}

      </div>


      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="product-content">

        {/* CATEGORY */}

        {category && (
          <span className="product-category">
            {category.replaceAll("-", " ")}
          </span>
        )}


        {/* SUBCATEGORY */}

        {subCategory && (
          <div className="product-subcategory">
            {subCategory.replaceAll("-", " ")}
          </div>
        )}


        {/* NAME */}

        <h3 className="product-name">
          {productName}
        </h3>


        {/* DESCRIPTION */}

        {description && (
          <p className="product-description">
            {description}
          </p>
        )}


        {/* PRICE */}

        <div className="product-price-row">

          <span className="product-price">
            ₹{price.toFixed(2)}
          </span>

          {originalPrice > price && (
            <span className="product-original-price">
              ₹{originalPrice.toFixed(2)}
            </span>
          )}

        </div>


        {/* STOCK */}

        {stock > 0 && (
          <div
            className={`stock-text ${
              stock <= 5
                ? "low-stock"
                : ""
            }`}
          >
            {stock <= 5
              ? `Only ${stock} left`
              : `${stock} available`}
          </div>
        )}


        {/* ADD CART */}

        <button
          type="button"
          className="add-cart-button"
          onClick={handleAddToCart}
          disabled={stock <= 0}
        >
          {stock <= 0
            ? "Out of Stock"
            : "Add to Cart"}
        </button>

      </div>

    </article>
  );
}

export default ProductCard;