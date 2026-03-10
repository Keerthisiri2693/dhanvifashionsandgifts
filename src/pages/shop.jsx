import { useLocation } from "react-router-dom";
import products from "../data/products";
import ProductCard from "./ProductCard";

function Shop({ cart, setCart }) {

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const subcategory = query.get("subcategory");

  const filteredProducts = subcategory
    ? products.filter(p => p.subcategory === subcategory)
    : products;

  const addToCart = (product) => {

    setCart(prevCart => {

      const existing = prevCart.find(item => item.id === product.id);

      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];

    });

  };

  return (
    <div className="shop-page">

      <h1>Products</h1>

      <div className="products-grid">

        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}

      </div>

    </div>
  );
}

export default Shop;