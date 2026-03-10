import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Categories from "./pages/categories";
import Birthday from "./pages/Birthday";
import ReturnGifts from "./pages/giftscategory";
import Shop from "./pages/shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/orderconfirmation";
import MyOrder from "./pages/myorders";
import Viewdetails from "./pages/viewdetails";
import About from "./pages/about";
import Contact from "./pages/contact";
import Profile from "./pages/Profile";

import Login from "./pages/login";
import Register from "./pages/register";
import TrackOrder from "./pages/trackorders";

function App() {

  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>

      <Navbar cart={cart} />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/categories" element={<Categories />} />
        <Route path="/birthday" element={<Birthday />} />
        <Route path="/giftscategory" element={<ReturnGifts />} />

        <Route
          path="/shop"
          element={<Shop cart={cart} setCart={setCart} />}
        />

        <Route
          path="/cart"
          element={<Cart cart={cart} setCart={setCart} />}
        />

        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orderconfirmation" element={<OrderConfirmation />} />

        <Route path="/myorders" element={<MyOrder />} />
        <Route path="/viewdetails" element={<Viewdetails />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/profile" element={<Profile />} />

        {/* LOGIN + REGISTER */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trackorders" element={<TrackOrder />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;