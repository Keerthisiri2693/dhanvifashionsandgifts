import { Link } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../pages/ProductCard";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* HERO SECTION */}

      <section className="hero">

        <div className="hero-content">

          <h1>Dhanvi Fashion & Gifts</h1>

          <p>
            Beautiful Women Accessories, Organic Soaps & Return Gifts
            for Every Occasion
          </p>

          <Link to="/shop" className="hero-btn">
            Shop Now 🎁
          </Link>

        </div>

      </section>


      {/* CATEGORY SECTION */}

      <section className="section">

        <h2 className="section-title">Shop by Category</h2>

        <div className="categories">

          <Link to="/shop?category=birthday" className="category-card">
            🎂 Birthday Gifts
          </Link>

          <Link to="/shop?category=wedding" className="category-card">
            💍 Wedding Gifts
          </Link>

          <Link to="/shop?category=baby" className="category-card">
            👶 Baby Shower
          </Link>

          <Link to="/shop?category=festival" className="category-card">
            🎉 Festival Gifts
          </Link>

          <Link to="/shop?category=accessories" className="category-card">
            👗 Women Accessories
          </Link>

          <Link to="/shop?category=soap" className="category-card">
            🧼 Organic Soaps
          </Link>

        </div>

      </section>


      {/* FEATURED PRODUCTS */}

      <section className="section">

        <h2 className="section-title">Featured Products</h2>

        <div className="products-grid">

          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

        </div>

      </section>


      {/* FOOTER */}

      <Footer />

    </div>
  );
}

export default Home;