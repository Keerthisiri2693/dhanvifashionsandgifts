import { Link } from "react-router-dom";
import "./categories.css";

// import images
import birthday from "../assets/birthday.jpg";

import soap from "../assets/soap.jpg";
import accessory from "../assets/accessory.jpg"

function Categories() {

const categories = [
  {
    name: "Return Gifts 🎁",
    image: birthday,
    link: "/giftscategory",
    subcategories: [
      "birthday",
      "wedding",
      "baby-shower",
      "housewarming",
      "festival",
      "corporate"
    ]
  },
  {
    name: "Women Accessories 👗",
    image: accessory,
    link: "/shop?category=accessories",
    subcategories: [
      "earrings",
      "bracelets",
      "necklace",
      "hair-accessories",
      "rings"
    ]
  },
  {
    name: "Organic Soaps 🧼",
    image: soap,
    link: "/shop?category=soap",
    subcategories: [
      "rose-soap",
      "aloe-vera-soap",
      "multani-mitti-soap",
      "coconut-milk-soap",
      "red-wine-soap",
      "sandal-soap"
    ]
  }
];

  return (
    <div className="categories-page">

      <div className="categories-header">

        <h1>Shop by Categories</h1>
        <p>Find the perfect gift for every occasion</p>

      </div>

      <div className="categories-container">

        {categories.map((cat, index) => (

          <Link to={cat.link} key={index} className="category-card">

            <div className="category-image">
              <img src={cat.image} alt={cat.name} />
            </div>

            <div className="category-overlay">
              <h3>{cat.name}</h3>
              <span className="shop-btn">Shop Now</span>
            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}

export default Categories;