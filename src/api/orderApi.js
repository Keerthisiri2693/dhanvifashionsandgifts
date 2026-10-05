// =====================================================
// ORDER API
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://dhanvifashionbackend.onrender.com/api";

// =====================================================
// GET LOGGED-IN USER ID
// =====================================================

const getUserId = () => {
  const userId = localStorage.getItem("userId");

  // No userId = NOT LOGGED IN
  if (
    !userId ||
    userId === "1" ||
    userId === "null" ||
    userId === "undefined" ||
    userId.trim() === ""
  ) {
    return null;
  }

  return userId;
};

// =====================================================
// CHECK LOGIN
// =====================================================

export const isUserLoggedIn = () => {
  return !!getUserId();
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

  console.log("📦 ORDER API RESPONSE:", data);

  if (!response.ok || data.success === false) {
    throw new Error(
      data.message || "Order request failed"
    );
  }

  return data;
};

// =====================================================
// CREATE ORDER
// =====================================================

export const createOrder = async ({
  cartId,
  shippingAddress,
  paymentMethod = "cod",
}) => {

  // ===================================================
  // 1. CHECK LOGIN
  // ===================================================

  const userId = getUserId();

  console.log("=================================");
  console.log("🛒 CREATE ORDER");
  console.log("👤 USER ID:", userId);
  console.log("=================================");

  if (!userId) {
    throw new Error(
      "Please login before placing an order."
    );
  }

  // ===================================================
  // 2. CART VALIDATION
  // ===================================================

  if (!cartId) {
    throw new Error(
      "Cart ID is required."
    );
  }

  // ===================================================
  // 3. SHIPPING VALIDATION
  // ===================================================

  if (!shippingAddress) {
    throw new Error(
      "Shipping address is required."
    );
  }

  const requiredFields = [
    "name",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "pincode",
  ];

  for (const field of requiredFields) {

    const value =
      shippingAddress[field];

    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      throw new Error(
        `${field} is required.`
      );
    }
  }

  // ===================================================
  // 4. PAYMENT VALIDATION
  // ===================================================

  if (
    !["cod", "online"].includes(
      paymentMethod
    )
  ) {
    throw new Error(
      "Invalid payment method."
    );
  }

  // ===================================================
  // 5. DEBUG
  // ===================================================

  console.log("=================================");
  console.log("📦 CREATING ORDER");
  console.log("👤 USER ID:", userId);
  console.log("🛒 CART ID:", cartId);
  console.log("💳 PAYMENT:", paymentMethod);
  console.log("📍 SHIPPING:", shippingAddress);
  console.log("=================================");

  // ===================================================
  // 6. API REQUEST
  // ===================================================

  let response;

  try {

    response = await fetch(
      `${API_URL}/orders`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userId,
          cartId,
          shippingAddress,
          paymentMethod,
        }),
      }
    );

  } catch (error) {

    console.error(
      "❌ ORDER NETWORK ERROR:",
      error
    );

    throw new Error(
      "Unable to connect to the server."
    );
  }

  // ===================================================
  // 7. HANDLE RESPONSE
  // ===================================================

  const data =
    await handleResponse(response);

  // ===================================================
  // 8. CHECK ORDER
  // ===================================================

  if (!data.order) {

    console.error(
      "❌ ORDER OBJECT MISSING:",
      data
    );

    throw new Error(
      "Order was not created correctly."
    );
  }

  // ===================================================
  // 9. SUCCESS
  // ===================================================

  console.log("=================================");
  console.log("✅ ORDER PLACED");
  console.log(
    "🧾 ORDER ID:",
    data.order.orderId
  );
  console.log(
    "💰 TOTAL:",
    data.order.total
  );
  console.log("=================================");

  return data.order;
};

// =====================================================
// GET USER ORDERS
// =====================================================

export const getUserOrders = async () => {

  const userId = getUserId();

  if (!userId) {
    throw new Error(
      "Please login to view your orders."
    );
  }

  const response =
    await fetch(
      `${API_URL}/orders/user/${encodeURIComponent(
        userId
      )}`
    );

  const data =
    await handleResponse(response);

  return data.orders || [];
};

// =====================================================
// GET SINGLE ORDER
// =====================================================

export const getOrderById = async (
  orderId
) => {

  if (!orderId) {
    throw new Error(
      "Order ID is required."
    );
  }

  const response =
    await fetch(
      `${API_URL}/orders/${encodeURIComponent(
        orderId
      )}`
    );

  const data =
    await handleResponse(response);

  return data.order;
};

// =====================================================
// EXPORT
// =====================================================

export {
  API_URL,
  getUserId,
};