import { useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Kids Birthday Return Gift Pack",
      price: 199,
      image: "https://picsum.photos/200?1",
      quantity: 1
    },
    {
      id: 2,
      name: "Rose Organic Soap",
      price: 120,
      image: "https://picsum.photos/200?9",
      quantity: 1
    }
  ]);

  const increaseQty = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQty = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">

      <h1>Your Cart 🛒</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (

        <div className="cart-container">

          {cartItems.map(item => (

            <div key={item.id} className="cart-item">

              <img src={item.image} alt={item.name} />

              <div className="cart-details">

                <h3>{item.name}</h3>
                <p>₹{item.price}</p>

                <div className="quantity">

                  <button onClick={() => decreaseQty(item.id)}>-</button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseQty(item.id)}>+</button>

                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

          <div className="cart-total">

            <h2>Total: ₹{total}</h2>

            <Link to="/checkout">
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </Link>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cart;