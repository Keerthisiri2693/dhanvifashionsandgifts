import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import "./Shop.css";
import { addProductToCart } from "../api/cartApi";
const API_URL = "https://dhanvifashionbackend.onrender.com/api";

function Shop({ cart, setCart }) {
  const [searchParams] = useSearchParams();

  const category =
    searchParams.get("category")?.trim() || "";

  const subCategory =
    searchParams.get("subCategory")?.trim() || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (category) {
          params.set("category", category);
        }

        if (subCategory) {
          params.set("subCategory", subCategory);
        }

        const query = params.toString();

        const url = query
          ? `${API_URL}/products?${query}`
          : `${API_URL}/products`;

        console.log("=================================");
        console.log("🛍️ SHOP PAGE");
        console.log("📂 Category:", category || "ALL");
        console.log("📁 SubCategory:", subCategory || "ALL");
        console.log("🌐 URL:", url);
        console.log("=================================");

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `HTTP Error: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("📦 Product Response:", data);

        if (!data.success) {
          throw new Error(
            data.message || "Failed to load products"
          );
        }

        const fetchedProducts = Array.isArray(
          data.products
        )
          ? data.products
          : [];

        // Remove duplicate products
        const uniqueProducts = Array.from(
          new Map(
            fetchedProducts
              .filter((product) => product?._id)
              .map((product) => [
                String(product._id),
                product,
              ])
          ).values()
        );

        console.log(
          "📊 Products returned:",
          fetchedProducts.length
        );

        console.log(
          "✅ Unique products:",
          uniqueProducts.length
        );

        setProducts(uniqueProducts);

      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        console.error("❌ SHOP ERROR:", err);

        setProducts([]);
        setError(
          err.message ||
            "Unable to load products"
        );

      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      controller.abort();
    };

  }, [category, subCategory]);


  // =====================================================
  // ADD TO CART
  // =====================================================

const handleAddToCart = async (product) => {
  console.log("=================================");
  console.log("🛒 ADD TO CART CLICKED");
  console.log("=================================");

  try {
    const productId = product?._id;

    if (!productId) {
      throw new Error("Product ID not found.");
    }

    console.log("📦 PRODUCT:", product);
    console.log("🆔 PRODUCT ID:", productId);

    const updatedCart = await addProductToCart(
      String(productId),
      1
    );

    console.log(
      "✅ PRODUCT ADDED TO CART:",
      updatedCart
    );

    const items = Array.isArray(updatedCart?.items)
      ? updatedCart.items
      : [];

    // Update App cart state
    setCart(items);

    console.log("🛒 CART ITEMS:", items);
    console.log("🛒 CART COUNT:", items.length);

    // Notify Navbar / other components
    window.dispatchEvent(
      new Event("cartUpdated")
    );

  } catch (error) {
    console.error(
      "❌ ADD TO CART ERROR:",
      error
    );

    // IMPORTANT:
    // Don't use setError here.
    console.error(
      error.message ||
      "Unable to add product to cart."
    );
  }
};

  // =====================================================
  // FORMAT TEXT
  // =====================================================

  const formatText = (value) => {
    if (!value) {
      return "";
    }

    return value
      .split("-")
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };


  // =====================================================
  // PAGE TITLE
  // =====================================================

  const pageTitle =
    subCategory
      ? formatText(subCategory)
      : category
        ? formatText(category)
        : "All Products";


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="shop-page">

        <section className="shop-loading">
          <div className="shop-spinner" />

          <h3>
            Loading products...
          </h3>
        </section>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="shop-page">

        <section className="shop-error">

          <div className="shop-error-icon">
            ⚠️
          </div>

          <h2>
            Unable to Load Products
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="shop-retry-button"
            onClick={() => {
              window.location.reload();
            }}
          >
            Try Again
          </button>

        </section>

      </div>
    );
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="shop-page">

      {/* HEADER */}

      <section className="shop-header">

        <span className="shop-eyebrow">
          ✨ Dhanvi Collection
        </span>

        <h1>
          {pageTitle}
        </h1>

        <p>
          {products.length}{" "}
          {products.length === 1
            ? "product"
            : "products"}{" "}
          available
        </p>

      </section>


      {/* PRODUCTS */}

      {products.length > 0 ? (

        <section className="products-section">

          <div className="products-grid">

            {products.map((product) => (
              <ProductCard
                key={String(product._id)}
                product={product}
                addToCart={handleAddToCart}
              />
            ))}

          </div>

        </section>

      ) : (

        <section className="shop-empty">

          <div className="empty-icon">
            🛍️
          </div>

          <h2>
            No Products Found
          </h2>

          <p>
            No products are available for{" "}
            <strong>
              {pageTitle}
            </strong>.
          </p>

        </section>

      )}

    </div>
  );
}

export default Shop;
