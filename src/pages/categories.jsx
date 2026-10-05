import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./categories.css";

// Local fallback images
import birthday from "../assets/birthday.jpg";
import soap from "../assets/soap.jpg";
import accessory from "../assets/accessory.jpg";
import beauty from "../assets/accessory.jpg";
import bags from "../assets/accessory.jpg";
import homeDecor from "../assets/accessory.jpg";
import pooja from "../assets/accessory.jpg";

const API_URL = "https://dhanvifashionbackend.onrender.com/api";
const SERVER_URL = "https://dhanvifashionbackend.onrender.com";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  // ==================================================
  // FETCH ALL CATEGORIES
  // ==================================================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

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
        "Categories API Response:",
        data
      );

      if (data.success) {
        setCategories(
          Array.isArray(data.categories)
            ? data.categories
            : []
        );
      } else {
        setError(
          data.message ||
            "Unable to load categories"
        );
      }
    } catch (error) {
      console.error(
        "Category API Error:",
        error
      );

      setError(
        "Unable to connect to server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // FALLBACK CATEGORY IMAGES
  // ==================================================

  const getFallbackImage = (slug) => {
    const imageMap = {
      "return-gifts": birthday,
      accessories: accessory,
      soap: soap,
      "beauty-personal-care": beauty,
      "bags-pouches": bags,
      "home-decor": homeDecor,
      "pooja-spiritual": pooja,
    };

    return (
      imageMap[slug] || birthday
    );
  };

  // ==================================================
  // CATEGORY IMAGE
  // ==================================================

  const getCategoryImage = (category) => {
    if (!category?.image) {
      return getFallbackImage(
        category?.slug
      );
    }

    if (
      category.image.startsWith("http://") ||
      category.image.startsWith("https://")
    ) {
      return category.image;
    }

    return `${SERVER_URL}${category.image}`;
  };

  // ==================================================
  // CATEGORY → SUBCATEGORY PAGE
  // ==================================================

  const getCategoryLink = (category) => {
    return `/categories/${encodeURIComponent(
      category.slug
    )}`;
  };

  // ==================================================
  // IMAGE ERROR HANDLER
  // ==================================================

  const handleImageError = (
    event,
    slug
  ) => {
    event.currentTarget.src =
      getFallbackImage(slug);
  };

  return (
    <div className="categories-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="categories-header">

        <h1>
          Shop by Categories
        </h1>

        <p>
          Find the perfect gift for
          every occasion
        </p>

      </div>


      {/* ==================================================
          LOADING
      ================================================== */}

      {loading && (
        <div className="categories-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading categories...
          </p>

        </div>
      )}


      {/* ==================================================
          ERROR
      ================================================== */}

      {!loading && error && (
        <div className="categories-error">

          <p>{error}</p>

          <button
            type="button"
            onClick={fetchCategories}
            className="retry-btn"
          >
            Try Again
          </button>

        </div>
      )}


      {/* ==================================================
          EMPTY
      ================================================== */}

      {!loading &&
        !error &&
        categories.length === 0 && (
          <div className="categories-empty">

            <p>
              No categories available.
            </p>

          </div>
        )}


      {/* ==================================================
          CATEGORY CARDS
      ================================================== */}

      {!loading &&
        !error &&
        categories.length > 0 && (

          <div className="categories-container">

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

                    {/* IMAGE */}

                    <div className="category-image">

                      <img
                        src={image}
                        alt={category.name}
                        loading="lazy"
                        onError={(
                          event
                        ) =>
                          handleImageError(
                            event,
                            category.slug
                          )
                        }
                      />

                    </div>


                    {/* OVERLAY */}

                    <div className="category-overlay">

                      <h3>
                        {category.name}
                      </h3>

                      <span className="shop-btn">
                        Shop Now
                      </span>

                    </div>

                  </Link>
                );
              }
            )}

          </div>
        )}

    </div>
  );
}

export default Categories;