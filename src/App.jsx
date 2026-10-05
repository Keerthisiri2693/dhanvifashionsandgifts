import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Categories from "./pages/categories";
import Subcategories from "./pages/subcategory";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/orderconfirmation";
import MyOrder from "./pages/myorders";
import About from "./pages/about";
import Contact from "./pages/contact";
import Profile from "./pages/Profile";

import Login from "./pages/login";
import Register from "./pages/register";
import TrackOrder from "./pages/trackorders";

import OrderDetails from "./pages/OrderDetails";
import EditProfile from "./pages/EditProfile";

import { getCart } from "./api/cartApi";

function App() {

  // =====================================================
  // CART STATE
  // =====================================================

  const [cart, setCart] = useState([]);

  // =====================================================
  // LOAD CART WHEN APP STARTS
  // =====================================================

  useEffect(() => {

    const loadCart = async () => {

      try {

        console.log("🛒 APP: Loading cart...");

        const cartData = await getCart();

        console.log(
          "🛒 APP: Cart response:",
          cartData
        );

        /*
         * Depending on your API response,
         * cart may be returned directly or
         * inside data/cart.
         */

        const actualCart =
          cartData?.cart ||
          cartData?.data?.cart ||
          cartData;

        const items = Array.isArray(
          actualCart?.items
        )
          ? actualCart.items
          : [];

        console.log(
          "🛒 APP: Cart items:",
          items
        );

        setCart(items);

      } catch (error) {

        console.error(
          "❌ APP: Unable to load cart:",
          error
        );

        setCart([]);
      }
    };

    loadCart();

  }, []);

  // =====================================================
  // DEBUG CART STATE
  // =====================================================

  useEffect(() => {

    console.log(
      "🔄 APP CART STATE UPDATED:",
      cart
    );

    const count = cart.reduce(
      (total, item) =>
        total + Number(item?.quantity || 1),
      0
    );

    console.log(
      "🛒 APP CART COUNT:",
      count
    );

  }, [cart]);

  // =====================================================
  // APP
  // =====================================================

  return (
    <BrowserRouter>

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar
        cart={cart}
      />

      {/* =================================================
          ROUTES
      ================================================= */}

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={
            <Home />
          }
        />

        {/* CATEGORIES */}

        <Route
          path="/categories"
          element={
            <Categories />
          }
        />

        {/* SUBCATEGORIES */}

        <Route
          path="/categories/:categorySlug"
          element={
            <Subcategories />
          }
        />

        {/* SHOP */}

        <Route
          path="/shop"
          element={
            <Shop
              cart={cart}
              setCart={setCart}
            />
          }
        />

        {/* CART */}

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
            />
          }
        />

        {/* CHECKOUT */}

        <Route
          path="/checkout"
          element={
            <Checkout />
          }
        />

        {/* ORDER CONFIRMATION */}

        <Route
          path="/orderconfirmation"
          element={
            <OrderConfirmation />
          }
        />

        {/* MY ORDERS */}

        <Route
          path="/myorders"
          element={
            <ProtectedRoute>
              <MyOrder />
            </ProtectedRoute>
          }
        />

        {/* ORDER DETAILS */}

        <Route
          path="/OrderDetails/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        {/* ABOUT */}

        <Route
          path="/about"
          element={
            <About />
          }
        />

        {/* CONTACT */}

        <Route
          path="/contact"
          element={
            <Contact />
          }
        />

        {/* PROFILE */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* EDIT PROFILE */}

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        {/* REGISTER */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />

        {/* TRACK ORDER */}

        <Route
          path="/trackorders/:orderId"
          element={
            <TrackOrder />
          }
        />

        {/* UNKNOWN URL */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;