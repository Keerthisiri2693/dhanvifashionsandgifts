import products from "../data/products";
import ProductCard from "../pages/ProductCard";
import "./Birthday.css";

function Birthday() {

  const birthdayProducts = products.filter(
    (item) => item.category === "birthday"
  );

  return (
    <div className="birthday-page">

      {/* HEADER */}

      <div className="birthday-header">
        <h1>🎂 Birthday Return Gifts</h1>
        <p>Perfect return gifts for kids birthday celebrations</p>
      </div>


      {/* PRODUCTS */}

      <div className="birthday-products">

        {birthdayProducts.length > 0 ? (

          birthdayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))

        ) : (

          <p className="no-products">
            No birthday products available
          </p>

        )}

      </div>

    </div>
  );
}

export default Birthday;