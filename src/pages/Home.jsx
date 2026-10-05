import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../pages/ProductCard";
import Footer from "../components/Footer";

import "./Home.css";


import { addProductToCart,getCart } from "../api/cartApi";

const API_URL = "https://dhanvifashionbackend.onrender.com/api";
const SERVER_URL = "https://dhanvifashionbackend.onrender.com";


function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [categoryLoading, setCategoryLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(true);

  const [categoryError, setCategoryError] = useState("");
  const [productError, setProductError] = useState("");

  // =========================================================
  // FETCH CATEGORIES FROM BACKEND
  // =========================================================

useEffect(() => {

  fetchCategories();
  fetchFeaturedProducts();
  loadCart();

  const handleCartUpdated = () => {
    console.log(
      "🔄 Cart changed — loading latest cart"
    );

    loadCart();
  };

  window.addEventListener(
    "cartUpdated",
    handleCartUpdated
  );

  return () => {
    window.removeEventListener(
      "cartUpdated",
      handleCartUpdated
    );
  };

}, []);


const loadCart = async () => {
  try {
    console.log("🛒 Loading cart...");

    const cartData = await getCart();

    console.log("🛒 CART LOADED:", cartData);

    const items = Array.isArray(cartData?.items)
      ? cartData.items
      : [];

    console.log("🛒 CART ITEMS:", items);

    setCart(items);

  } catch (error) {
    console.error("❌ LOAD CART ERROR:", error);

    setCart([]);
  }
};

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError("");

      const response = await fetch(
        `${API_URL}/categories`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch categories: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Home Categories API Response:",
        data
      );

      if (data.success) {
        setCategories(
          data.categories || []
        );
      } else {
        setCategoryError(
          data.message ||
            "Unable to load categories"
        );
      }
    } catch (error) {
      console.error(
        "Home categories error:",
        error
      );

      setCategoryError(
        "Unable to connect to server"
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  // =========================================================
  // FETCH FEATURED PRODUCTS
  // =========================================================

  const fetchFeaturedProducts = async () => {
    try {
      setProductLoading(true);
      setProductError("");

      const response = await fetch(
        `${API_URL}/products?featured=true`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch products: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Featured Products API Response:",
        data
      );

      if (data.success) {
        setProducts(
          data.products || []
        );
      } else {
        setProductError(
          data.message ||
            "Unable to load products"
        );
      }
    } catch (error) {
      console.error(
        "Featured products error:",
        error
      );

      setProductError(
        "Unable to connect to server"
      );
    } finally {
      setProductLoading(false);
    }
  };

  // =========================================================
  // CATEGORY IMAGE
  // =========================================================

  const getCategoryImage = (category) => {
    if (!category?.image) {
      return null;
    }

    if (
      category.image.startsWith("http")
    ) {
      return category.image;
    }

    return `${SERVER_URL}${category.image}`;
  };

  // =========================================================
  // CATEGORY ICON FALLBACK
  // =========================================================

  const getCategoryEmoji = (slug) => {
    const emojiMap = {
      "return-gifts": "🎁",
      accessories: "👗",
      soap: "🧼",
      "beauty-personal-care": "💄",
      "bags-pouches": "👜",
      "home-decor": "🕯️",
      "pooja-spiritual": "🌸",
    };

    return emojiMap[slug] || "🛍️";
  };

  // =========================================================
  // CATEGORY LINK
  // =========================================================

  const getCategoryLink = (category) => {
    return `/categories/${encodeURIComponent(
      category.slug
    )}`;
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

const handleAddToCart = async (product) => {
  console.log("=================================");
  console.log("🛒 ADD TO CART CLICKED");
  console.log("=================================");

  try {
    // =================================================
    // 1. GET PRODUCT ID
    // =================================================

    const productId =
      product?._id || product?.id;

    if (!productId) {
      throw new Error(
        "Product ID not found."
      );
    }

    console.log(
      "📦 PRODUCT:",
      product
    );

    console.log(
      "🆔 PRODUCT ID:",
      productId
    );

    // =================================================
    // 2. ADD PRODUCT TO BACKEND CART
    // =================================================

    const updatedCart =
      await addProductToCart(
        productId,
        1
      );

    console.log(
      "✅ PRODUCT ADDED TO CART:",
      updatedCart
    );

    // =================================================
    // 3. UPDATE CART STATE
    // =================================================

    const items =
      Array.isArray(
        updatedCart?.items
      )
        ? updatedCart.items
        : [];

    setCart(items);

    console.log(
      "🛒 CART ITEMS:",
      items
    );

    // =================================================
    // 4. CART COUNT
    // =================================================

    const cartCount =
      items.reduce(
        (total, item) =>
          total +
          Number(
            item.quantity || 1
          ),
        0
      );

    console.log(
      "🛒 CART COUNT:",
      cartCount
    );

    // =================================================
    // 5. NOTIFY NAVBAR
    // =================================================

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    // =================================================
    // 6. SUCCESS
    // =================================================

    console.log(
      "✅ Product added successfully"
    );

  } catch (error) {

    console.error(
      "❌ ADD TO CART ERROR:",
      error
    );

    // No window.alert()
    if (typeof setError === "function") {
      setError(
        error.message ||
        "Unable to add product to cart."
      );
    }
  }
};

  return (
    <div className="home">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="hero-small-title">
            ✨ Welcome to Dhanvi
          </span>

          <h1>
            Dhanvi Fashion
            <br />
            <span>& Gifts</span>
          </h1>

          <p>
            Beautiful accessories, organic soaps,
            return gifts and thoughtful products
            for every special occasion.
          </p>

          <div className="hero-buttons">

            <Link
              to="/categories"
              className="hero-btn primary"
            >
              Explore Collections
              <span>→</span>
            </Link>

            <Link
              to="/shop"
              className="hero-btn secondary"
            >
              Shop Now 🛍️
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="section category-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              OUR COLLECTION
            </span>

            <h2 className="section-title">
              Shop by Category
            </h2>

            <p className="section-subtitle">
              Discover something beautiful for
              every occasion
            </p>

          </div>

          <Link
            to="/categories"
            className="view-all-link"
          >
            View All →
          </Link>

        </div>


        {/* CATEGORY LOADING */}

        {categoryLoading && (

          <div className="categories-loading">

            {[1, 2, 3, 4].map(
              (item) => (

                <div
                  key={item}
                  className="category-skeleton"
                >

                  <div className="category-skeleton-icon"></div>

                  <div className="category-skeleton-line"></div>

                  <div className="category-skeleton-small"></div>

                </div>

              )
            )}

          </div>

        )}


        {/* CATEGORY ERROR */}

        {!categoryLoading &&
          categoryError && (

            <div className="products-message error">

              <div className="message-icon">
                ⚠️
              </div>

              <h3>
                Unable to load categories
              </h3>

              <p>
                Please make sure the backend
                server is running.
              </p>

              <button
                type="button"
                onClick={fetchCategories}
                className="retry-home-btn"
              >
                Try Again
              </button>

            </div>

          )}


        {/* CATEGORY EMPTY */}

        {!categoryLoading &&
          !categoryError &&
          categories.length === 0 && (

            <div className="products-message">

              <div className="message-icon">
                🛍️
              </div>

              <h3>
                No categories available
              </h3>

              <p>
                Categories will appear here
                once they are added.
              </p>

            </div>

          )}


        {/* CATEGORY LIST */}

        {!categoryLoading &&
          !categoryError &&
          categories.length > 0 && (

            <div className="categories">

              {categories.map(
                (category) => {

                  const image =
                    getCategoryImage(
                      category
                    );

                  return (
                    <Link
                      key={
                        category._id ||
                        category.slug
                      }
                      to={getCategoryLink(
                        category
                      )}
                      className="category-card"
                    >

                      {/* IMAGE / ICON */}

                      <div className="category-icon">

                        {image ? (

                          <img
                            src={image}
                            alt={category.name}
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";

                              event.currentTarget.parentElement
                                .classList.add(
                                  "show-emoji"
                                );
                            }}
                          />

                        ) : (

                          <span>
                            {getCategoryEmoji(
                              category.slug
                            )}
                          </span>

                        )}

                        <span className="category-fallback-emoji">
                          {getCategoryEmoji(
                            category.slug
                          )}
                        </span>

                      </div>


                      {/* CATEGORY CONTENT */}

                      <div className="category-info">

                        <h3>
                          {category.name}
                        </h3>

                        <p>
                          {category.description ||
                            "Explore our collection"}
                        </p>

                        <span className="category-explore">
                          Explore →
                        </span>

                      </div>

                    </Link>
                  );
                }
              )}

            </div>

          )}

      </section>


      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <section className="section featured-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              HANDPICKED FOR YOU
            </span>

            <h2 className="section-title">
              Featured Products
            </h2>

            <p className="section-subtitle">
              Our most loved products, selected
              especially for you
            </p>

          </div>

          <Link
            to="/shop"
            className="view-all-link"
          >
            View All Products →
          </Link>

        </div>


        {/* PRODUCT LOADING */}

        {productLoading && (

          <div className="products-grid">

            {[1, 2, 3, 4].map(
              (item) => (

                <div
                  className="product-skeleton"
                  key={item}
                >

                  <div className="skeleton-image"></div>

                  <div className="skeleton-line"></div>

                  <div className="skeleton-line small"></div>

                  <div className="skeleton-button"></div>

                </div>

              )
            )}

          </div>

        )}


        {/* PRODUCT ERROR */}

        {!productLoading &&
          productError && (

            <div className="products-message error">

              <div className="message-icon">
                ⚠️
              </div>

              <h3>
                Unable to load products
              </h3>

              <p>
                Please make sure the backend
                server is running.
              </p>

              <button
                type="button"
                onClick={
                  fetchFeaturedProducts
                }
                className="retry-home-btn"
              >
                Try Again
              </button>

            </div>

          )}


        {/* EMPTY */}

        {!productLoading &&
          !productError &&
          products.length === 0 && (

            <div className="products-message">

              <div className="message-icon">
                🛍️
              </div>

              <h3>
                No featured products yet
              </h3>

              <p>
                Check back soon for new products.
              </p>

            </div>

          )}


        {/* PRODUCTS */}

        {!productLoading &&
          !productError &&
          products.length > 0 && (

            <div className="products-grid">

              {products
                .slice(0, 8)
                .map(
                  (product) => (

                    <ProductCard
                      key={
                        product._id ||
                        product.id
                      }
                      product={product}
                      addToCart={
                        handleAddToCart
                      }
                    />

                  )
                )}

            </div>

          )}

      </section>


      {/* =====================================================
          SPECIAL COLLECTION
      ===================================================== */}

      <section className="home-banner">

        <div className="home-banner-decoration">
          🎁
        </div>

        <div className="home-banner-content">

          <span className="banner-label">
            🎁 SPECIAL COLLECTION
          </span>

          <h2>
            Make Every Occasion
            <br />
            Extra Special
          </h2>

          <p>
            Find beautiful gifts and accessories
            made for memorable moments.
          </p>

          <Link
            to="/shop"
            className="banner-btn"
          >
            Start Shopping
            <span>→</span>
          </Link>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>
  );
}

export default Home;