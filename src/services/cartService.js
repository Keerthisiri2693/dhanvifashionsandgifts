import { getCartId } from "../data/Cart";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://dhanvifashionbackend.onrender.com/api";


// =====================================================
// RESPONSE HANDLER
// =====================================================

const handleResponse = async (response) => {
  let data = {};

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid server response");
  }

  console.log("🛒 API RESPONSE:", data);

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};


// =====================================================
// GET LOGGED-IN USER ID
// =====================================================

const getLoggedInUserId = () => {
  const userId =
    localStorage.getItem("userId");

  // IMPORTANT:
  // Do NOT create a test user.
  // Do NOT automatically login a user.

  if (!userId || userId === "1") {
    return null;
  }

  return userId;
};


// =====================================================
// ADD PRODUCT TO CART
// POST /api/cart/add
// =====================================================

export const addProductToCart = async (
  productId,
  quantity = 1
) => {

  // -------------------------------------------------
  // GET CART ID
  // -------------------------------------------------

  const cartId = getCartId();


  // -------------------------------------------------
  // GET LOGGED-IN USER
  // -------------------------------------------------

  const userId =
    getLoggedInUserId();


  console.log("=================================");
  console.log("🛒 ADD PRODUCT TO CART");
  console.log("🛒 CART ID:", cartId);
  console.log("👤 USER ID:", userId);
  console.log("📦 PRODUCT ID:", productId);
  console.log("🔢 QUANTITY:", quantity);
  console.log("=================================");


  // -------------------------------------------------
  // LOGIN CHECK
  // -------------------------------------------------

  if (!userId) {

    throw new Error(
      "Please login before adding products to cart."
    );

  }


  // -------------------------------------------------
  // CART VALIDATION
  // -------------------------------------------------

  if (!cartId) {

    throw new Error(
      "Cart ID not found."
    );

  }


  // -------------------------------------------------
  // PRODUCT VALIDATION
  // -------------------------------------------------

  if (!productId) {

    throw new Error(
      "Product ID is required."
    );

  }


  // -------------------------------------------------
  // QUANTITY VALIDATION
  // -------------------------------------------------

  const qty = Number(quantity);

  if (
    !Number.isInteger(qty) ||
    qty < 1
  ) {

    throw new Error(
      "Invalid quantity."
    );

  }


  // -------------------------------------------------
  // API REQUEST
  // -------------------------------------------------

  const response = await fetch(
    `${API_URL}/cart/add`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        cartId,
        userId,
        productId,
        quantity: qty,
      }),
    }
  );


  // -------------------------------------------------
  // HANDLE RESPONSE
  // -------------------------------------------------

  const data =
    await handleResponse(response);


  // -------------------------------------------------
  // SUCCESS
  // -------------------------------------------------

  console.log(
    "✅ PRODUCT ADDED TO CART:",
    data.cart
  );


  return data.cart;
};


// =====================================================
// EXPORT
// =====================================================

export {
  API_URL,
  getLoggedInUserId,
};