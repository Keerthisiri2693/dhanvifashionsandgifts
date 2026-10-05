const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://dhanvifashionbackend.onrender.com/api";

// =====================================================
// GET LOGGED-IN USER ID
// =====================================================

export const getUserId = () => {
  const userId =
    localStorage.getItem("userId");

  // No automatic/test user
  if (!userId || userId === "1") {
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
// GET CART ID
// =====================================================

export const getCartId = (cart) => {
  if (!cart) {
    return null;
  }

  // Normal API response
  if (cart.cartId) {
    return cart.cartId;
  }

  // Response: { cart: {...} }
  if (cart.cart?.cartId) {
    return cart.cart.cartId;
  }

  // Response: { _cart: {...} }
  if (cart._cart?.cartId) {
    return cart._cart.cartId;
  }

  return null;
};

// =====================================================
// RESPONSE HANDLER
// =====================================================

const handleResponse = async (response) => {
  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    console.error(
      "❌ JSON PARSE ERROR:",
      error
    );
  }

  console.log(
    "📦 ORDER API RESPONSE:",
    data
  );

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed with status ${response.status}`
    );
  }

  if (data.success === false) {
    throw new Error(
      data.message ||
        "Order request failed"
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

  // =================================================
  // GET LOGGED-IN USER
  // =================================================

  const userId = getUserId();

  console.log(
    "🔐 CREATE ORDER LOGIN CHECK"
  );

  console.log(
    "👤 USER ID:",
    userId
  );

  // =================================================
  // VALIDATE USER
  // =================================================

  if (!userId) {
    throw new Error(
      "Please login before placing your order."
    );
  }

  // =================================================
  // VALIDATE CART
  // =================================================

  if (!cartId) {
    throw new Error(
      "Cart ID not found."
    );
  }

  // =================================================
  // VALIDATE SHIPPING
  // =================================================

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
    if (
      !shippingAddress[field] ||
      String(
        shippingAddress[field]
      ).trim() === ""
    ) {
      throw new Error(
        `${field} is required`
      );
    }
  }

  // =================================================
  // PAYMENT VALIDATION
  // =================================================

  if (
    !["cod", "online"].includes(
      paymentMethod
    )
  ) {
    throw new Error(
      "Please select a valid payment method."
    );
  }

  // =================================================
  // DEBUG
  // =================================================

  console.log(
    "================================="
  );

  console.log(
    "📦 CREATING ORDER"
  );

  console.log(
    "👤 USER ID:",
    userId
  );

  console.log(
    "🛒 CART ID:",
    cartId
  );

  console.log(
    "💳 PAYMENT:",
    paymentMethod
  );

  console.log(
    "📍 SHIPPING:",
    shippingAddress
  );

  console.log(
    "================================="
  );

  // =================================================
  // API REQUEST
  // =================================================

  const response = await fetch(
    `${API_URL}/orders`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        userId,
        cartId,
        shippingAddress,
        paymentMethod,
      }),
    }
  );

  // =================================================
  // HANDLE RESPONSE
  // =================================================

  const data =
    await handleResponse(response);

  // =================================================
  // SUCCESS
  // =================================================

  console.log(
    "================================="
  );

  console.log(
    "✅ ORDER CREATED:"
  );

  console.log(
    "🧾 ORDER:",
    data.order
  );

  console.log(
    "================================="
  );

  return data.order;
};

// =====================================================
// GET USER ORDERS
// =====================================================

export const getUserOrders = async () => {

  const userId = getUserId();

  // =================================================
  // LOGIN CHECK
  // =================================================

  if (!userId) {
    throw new Error(
      "Please login to view your orders."
    );
  }

  console.log(
    "📦 GET USER ORDERS"
  );

  console.log(
    "👤 USER ID:",
    userId
  );

  const response =
    await fetch(
      `${API_URL}/orders/user/${userId}`
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
      "Order ID is required"
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
};