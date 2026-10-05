import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./subcategory.css";

const API_URL = "https://dhanvifashionbackend.onrender.com/api";
const SERVER_URL = "https://dhanvifashionbackend.onrender.com";

function Subcategories() {
  const { categorySlug } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // CATEGORY SLUG -> PRODUCT DATABASE CATEGORY
  // =====================================================

  const categoryMap = {
    "return-gifts": "birthday",

    "organic-soap": "soap",
    soap: "soap",

    "women-accessories": "women-accessories",
    accessories: "women-accessories",

    "beauty-personal-care": "beauty",

    "bags-pouches": "bags",

    "home-decor": "home-decor",

    "pooja-items": "pooja",
  };

  // =====================================================
  // FETCH CATEGORY
  // =====================================================

  useEffect(() => {
    if (categorySlug) {
      fetchCategory();
    }
  }, [categorySlug]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError("");

      if (!categorySlug) {
        setCategory(null);
        setError("Category not found.");
        return;
      }

      console.log("=================================");
      console.log("📂 FETCH CATEGORY");
      console.log("🔗 Category Slug:", categorySlug);
      console.log("=================================");

      const response = await fetch(
        `${API_URL}/categories/${encodeURIComponent(categorySlug)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      console.log("📦 Category API Response:", data);

      if (data.success && data.category) {
        setCategory(data.category);
      } else {
        setCategory(null);
        setError(data.message || "Category not found");
      }
    } catch (error) {
      console.error("❌ Category Error:", error);

      setCategory(null);
      setError(
        "Unable to load category. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DATABASE CATEGORY
  // =====================================================

  const getDatabaseCategory = () => {
    return (
      categoryMap[categorySlug] ||
      category?.productCategory ||
      category?.databaseCategory ||
      category?.slug ||
      categorySlug
    );
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImage = (image) => {
    if (!image) {
      return "/placeholder.jpg";
    }

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
  // IMAGE ERROR
  // =====================================================

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = "/placeholder.jpg";
  };

  // =====================================================
  // SUBCATEGORY -> SHOP
  // =====================================================

  const getSubcategoryLink = (subcategory) => {
    const databaseCategory = getDatabaseCategory();

    const databaseSubCategory =
      subcategory?.databaseSubCategory ||
      subcategory?.productSubCategory ||
      subcategory?.slug ||
      "";

    const shopLink =
      `/shop?category=${encodeURIComponent(
        databaseCategory
      )}&subCategory=${encodeURIComponent(
        databaseSubCategory
      )}`;

    console.log("=================================");
    console.log("🛍️ SUBCATEGORY CLICK");
    console.log("📌 Category:", databaseCategory);
    console.log("📌 Subcategory:", databaseSubCategory);
    console.log("🌐 Shop URL:", shopLink);
    console.log("=================================");

    return shopLink;
  };

  // =====================================================
  // LOADING SKELETON
  // =====================================================

  if (loading) {
    return (
      <div className="subcategory-page">

        <div className="subcategory-hero skeleton-hero">
          <div className="skeleton skeleton-small"></div>
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-description"></div>
        </div>

        <div className="subcategory-container">

          {Array.from({ length: 6 }).map((_, index) => (
            <div
              className="subcategory-card skeleton-card"
              key={index}
            >
              <div className="skeleton skeleton-image"></div>

              <div className="skeleton-content">
                <div className="skeleton skeleton-line"></div>
                <div className="skeleton skeleton-line short"></div>
              </div>
            </div>
          ))}

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="subcategory-page">

        <div className="subcategory-error">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={fetchCategory}
            className="retry-btn"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
  <div className="subcategory-page">

    {/* HERO */}
    <section className="subcategory-hero">

      <div className="subcategory-hero-content">

        <span className="subcategory-eyebrow">
          DHANVI COLLECTION
        </span>

        <h1>
          {category?.name || "Category"}
        </h1>

        {category?.description && (
          <p>
            {category.description}
          </p>
        )}

        <div className="subcategory-divider" />

        <span className="subcategory-count">
          {category?.subcategories?.length || 0} Collections
        </span>

      </div>

    </section>


    {/* SUBCATEGORIES */}

    {category?.subcategories?.length > 0 ? (

      <section className="subcategory-section">

        <div className="subcategory-section-header">

          <div>
            <span className="section-label">
              EXPLORE
            </span>

            <h2>
              Shop by Collection
            </h2>
          </div>

          <p>
            Discover our carefully selected collections
          </p>

        </div>


        <div className="subcategory-container">

          {category.subcategories.map(
            (subcategory, index) => {

              const image =
                getImage(subcategory?.image);

              const shopLink =
                getSubcategoryLink(subcategory);

              return (
                <Link
                  key={
                    subcategory?._id ||
                    subcategory?.slug ||
                    subcategory?.name
                  }
                  to={shopLink}
                  className="subcategory-card"
                >

                  <div className="subcategory-image">

                    <img
                      src={image}
                      alt={subcategory?.name}
                      loading="lazy"
                      onError={handleImageError}
                    />

                    <div className="subcategory-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="subcategory-image-overlay">

                      <span>
                        Shop Now →
                      </span>

                    </div>

                  </div>


                  <div className="subcategory-content">

                    <span className="subcategory-small-title">
                      DHANVI
                    </span>

                    <h3>
                      {subcategory?.name}
                    </h3>

                    <div className="subcategory-bottom">

                      <span>
                        Explore Collection
                      </span>

                      <span className="arrow">
                        →
                      </span>

                    </div>

                  </div>

                </Link>
              );
            }
          )}

        </div>

      </section>

    ) : (

      <div className="subcategory-empty">

        <div className="empty-icon">
          🛍️
        </div>

        <h2>
          No Collections Found
        </h2>

        <p>
          There are no collections available
          for this category.
        </p>

      </div>

    )}

  </div>
);
}

export default Subcategories;