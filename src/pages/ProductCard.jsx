import { useState, useEffect } from "react";
import "./ProductCard.css";

function ProductCard({ product, addToCart }) {

  const [favorite, setFavorite] = useState(false);

  // Load favorite from localStorage
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favs.includes(product.id)) {
      setFavorite(true);
    }
  }, [product.id]);

  const toggleFavorite = () => {

    let favs = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorite) {
      favs = favs.filter(id => id !== product.id);
      setFavorite(false);
    } else {
      favs.push(product.id);
      setFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(favs));
  };

  return (
    <div className="product-card">

     <span
  className={`favorite ${favorite ? "active" : ""}`}
  onClick={toggleFavorite}
>
  ❤️
</span>

      <img src={product.image} alt={product.name} />

      <h3>{product.name}</h3>

      <p>₹{product.price}</p>

      <button
        onClick={() => {
          addToCart(product);
        }}
      >
        Add to Cart
      </button>

    </div>
  );
}

export default ProductCard;