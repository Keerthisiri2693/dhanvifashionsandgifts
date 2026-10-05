// =====================================================
// CART API
// =====================================================

import { getCartId } from "../data/Cart";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://dhanvifashionbackend.onrender.com/api";

// =====================================================
// GET LOGGED-IN USER ID
// =====================================================

const getUserId = () => {
  const userId = localStorage.getItem("userId");

  // No fake/test user
  if (
    !userId ||
    userId === "1" ||
    userId === "null" ||
    userId === "undefined"
  ) {
    return null;
  }

  return userId;
};

// =====================================================
// RESPONSE HANDLER
// =====================================================

const handleResponse = async (response) => {
  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    console.error("❌ JSON RESPONSE ERROR:", error);
  }

  console.log("🛒 CART API RESPONSE:", data);

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || "Cart request failed"
    );
  }

  return data;
};

// =====================================================
// ADD PRODUCT TO CART
// POST /api/cart/add
// =====================================================

export const addProductToCart = async (
  productId,
  quantity = 1
) => {
  const cartId = getCartId();
  const userId = getUserId();

  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!cartId) {
    throw new Error("Cart ID is required");
  }

  const qty = Number(quantity);

  if (!Number.isInteger(qty) || qty < 1) {
    throw new Error("Invalid quantity");
  }

  console.log("=================================");
  console.log("🛒 ADD TO CART");
  console.log("Cart ID:", cartId);
  console.log("User ID:", userId);
  console.log("Product ID:", productId);
  console.log("Quantity:", qty);
  console.log("=================================");

  const response = await fetch(
    `${API_URL}/cart/add`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        cartId,
        userId,
        productId,
        quantity: qty,
      }),
    }
  );

  const data = await handleResponse(response);

  return data.cart;
};

// =====================================================
// GET CART
// GET /api/cart/:cartId
// =====================================================

export const getCart = async () => {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error("Cart ID is required");
  }

  console.log("🛒 GET CART");
  console.log("Cart ID:", cartId);

  const response = await fetch(
    `${API_URL}/cart/${encodeURIComponent(cartId)}`
  );

  const data = await handleResponse(response);

  console.log("✅ GET CART RESPONSE:", data);

  return data.cart;
};

// =====================================================
// UPDATE CART QUANTITY
// PUT /api/cart/update/:cartId/:productId
// =====================================================

export const updateCartQuantity = async (
  productId,
  quantity
) => {
  const cartId = getCartId();
  const userId = getUserId();

  if (!cartId) {
    throw new Error("Cart ID is required");
  }

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const qty = Number(quantity);

  if (!Number.isInteger(qty) || qty < 1) {
    throw new Error("Invalid quantity");
  }

  console.log("=================================");
  console.log("🛒 UPDATE CART");
  console.log("Cart ID:", cartId);
  console.log("User ID:", userId);
  console.log("Product ID:", productId);
  console.log("Quantity:", qty);
  console.log("=================================");

  const response = await fetch(
    `${API_URL}/cart/update/${encodeURIComponent(
      cartId
    )}/${encodeURIComponent(productId)}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId,
        quantity: qty,
      }),
    }
  );

  const data = await handleResponse(response);

  return data.cart;
};

// =====================================================
// REMOVE CART ITEM
// DELETE /api/cart/remove/:cartId/:productId
// =====================================================

export const removeCartItem = async (
  productId
) => {
  const cartId = getCartId();
  const userId = getUserId();

  if (!cartId) {
    throw new Error("Cart ID is required");
  }

  if (!productId) {
    throw new Error("Product ID is required");
  }

  console.log("=================================");
  console.log("🗑️ REMOVE CART ITEM");
  console.log("Cart ID:", cartId);
  console.log("User ID:", userId);
  console.log("Product ID:", productId);
  console.log("=================================");

  const response = await fetch(
    `${API_URL}/cart/remove/${encodeURIComponent(
      cartId
    )}/${encodeURIComponent(productId)}`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId,
      }),
    }
  );

  const data = await handleResponse(response);

  return data.cart;
};

// =====================================================
// CLEAR CART
// DELETE /api/cart/clear/:cartId
// =====================================================

export const clearCart = async () => {
  const cartId = getCartId();
  const userId = getUserId();

  if (!cartId) {
    throw new Error("Cart ID is required");
  }

  console.log("=================================");
  console.log("🧹 CLEAR CART");
  console.log("Cart ID:", cartId);
  console.log("User ID:", userId);
  console.log("=================================");

  const response = await fetch(
    `${API_URL}/cart/clear/${encodeURIComponent(
      cartId
    )}`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId,
      }),
    }
  );

  const data = await handleResponse(response);

  return data.cart;
};

// =====================================================
// EXPORT API URL
// =====================================================

export {
  API_URL,
  getUserId,
};