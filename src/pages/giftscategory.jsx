import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./giftscategory.css";

// Local fallback images
import birthday from "../assets/birthday.jpg";
import wedding from "../assets/wedding.jpg";
import babyshower from "../assets/babyshower.jpg";
import housewarming from "../assets/housewarming.jpg";
import festival from "../assets/festival.jpg";
import corporate from "../assets/corporate.png";

const API_URL = "https://dhanvifashionbackend.onrender.com/api";
const SERVER_URL = "https://dhanvifashionbackend.onrender.com";

function ReturnGifts() {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReturnGiftCategory();
  }, []);

  // --------------------------------------------------
  // FETCH RETURN GIFTS
  // --------------------------------------------------

  const fetchReturnGiftCategory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/categories/return-gifts`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch return gifts: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Return Gifts API Response:",
        data
      );

      if (data.success) {
        setCategory(data.category);
      } else {
        setError(
          data.message ||
            "Unable to load return gift categories"
        );
      }
    } catch (error) {
      console.error(
        "Return Gifts API Error:",
        error
      );

      setError(
        "Unable to connect to server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // FALLBACK SUBCATEGORY IMAGES
  // --------------------------------------------------

  const getFallbackImage = (slug) => {
    const imageMap = {
      birthday: birthday,
      wedding: wedding,
      "baby-shower": babyshower,
      housewarming: housewarming,
      festival: festival,
      corporate: corporate,
    };

    return imageMap[slug] || birthday;
  };

  // --------------------------------------------------
  // SUBCATEGORY IMAGE
  // --------------------------------------------------

  const getSubcategoryImage = (subcategory) => {
    if (!subcategory?.image) {
      return getFallbackImage(
        subcategory?.slug
      );
    }

    if (
      subcategory.image.startsWith("http")
    ) {
      return subcategory.image;
    }

    return `${SERVER_URL}${subcategory.image}`;
  };

  // --------------------------------------------------
  // SUBCATEGORY LINK
  // --------------------------------------------------

 const getSubcategoryLink = (subcategory) => {
  const databaseCategory = subcategory?.slug || "";

  // Map frontend subcategory slug
  // to the exact value stored in MongoDB
  const subCategoryMap = {
    birthday: "Return Gifts",
    wedding: "Wedding Gifts",
    baby: "Baby Shower",
    festival: "Gift Hamper",
    housewarming: "Return Gifts",
    corporate: "Corporate Gifts",
  };

  const databaseSubCategory =
    subCategoryMap[subcategory?.slug] ||
    subcategory?.name ||
    "";

  const url =
    `/shop?category=${encodeURIComponent(
      databaseCategory
    )}&subcategory=${encodeURIComponent(
      databaseSubCategory
    )}`;

  console.log("=================================");
  console.log("🛍️ SUBCATEGORY");
  console.log("📌 Name:", subcategory?.name);
  console.log("🔑 Slug:", subcategory?.slug);
  console.log(
    "📂 Database Category:",
    databaseCategory
  );
  console.log(
    "📁 Database SubCategory:",
    databaseSubCategory
  );
  console.log("🌐 Shop URL:", url);
  console.log("=================================");

  return url;
};

  // --------------------------------------------------
  // IMAGE ERROR
  // --------------------------------------------------

  const handleImageError = (event, slug) => {
    event.currentTarget.src =
      getFallbackImage(slug);
  };

  return (
    <div className="returngifts-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="returngifts-header">

        <h1 className="returngifts-title">
          {category?.name ||
            "Return Gift Categories 🎁"}
        </h1>

        {category?.description && (
          <p className="returngifts-description">
            {category.description}
          </p>
        )}

      </div>


      {/* ==========================================
          LOADING
      ========================================== */}

      {loading && (
        <div className="returngifts-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading return gift categories...
          </p>

        </div>
      )}


      {/* ==========================================
          ERROR
      ========================================== */}

      {!loading && error && (
        <div className="returngifts-error">

          <p>{error}</p>

          <button
            type="button"
            onClick={fetchReturnGiftCategory}
            className="retry-btn"
          >
            Try Again
          </button>

        </div>
      )}


      {/* ==========================================
          EMPTY
      ========================================== */}

      {!loading &&
        !error &&
        (!category ||
          !Array.isArray(
            category.subcategories
          ) ||
          category.subcategories.length === 0) && (
          <div className="returngifts-empty">

            <p>
              No return gift categories available.
            </p>

          </div>
        )}


      {/* ==========================================
          SUBCATEGORIES
      ========================================== */}

      {!loading &&
        !error &&
        Array.isArray(
          category?.subcategories
        ) &&
        category.subcategories.length > 0 && (

          <div className="returngifts-container">

            {category.subcategories.map(
              (subcategory) => {

                const image =
                  getSubcategoryImage(
                    subcategory
                  );

                return (
                  <Link
                    key={
                      subcategory._id ||
                      subcategory.slug
                    }
                    to={getSubcategoryLink(
                      subcategory.slug
                    )}
                    className="returngift-card"
                  >

                    {/* IMAGE */}

                    <div className="returngift-image">

                      <img
                        src={image}
                        alt={
                          subcategory.name
                        }
                        loading="lazy"
                        onError={(event) =>
                          handleImageError(
                            event,
                            subcategory.slug
                          )
                        }
                      />

                    </div>


                    {/* CONTENT */}

                    <div className="returngift-content">

                      <h3>
                        {subcategory.name}
                      </h3>

                      <span className="returngift-btn">
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

export default ReturnGifts;