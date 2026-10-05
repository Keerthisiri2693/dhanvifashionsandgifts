// =====================================================
// CART STORAGE
// =====================================================

const CART_ID_KEY = "dhanvi_cart_id";


// =====================================================
// GET CART ID
// =====================================================

export const getCartId = () => {

  let cartId =
    localStorage.getItem(CART_ID_KEY);

  // ---------------------------------------------------
  // Create cart ID if it does not exist
  // ---------------------------------------------------

  if (
    !cartId ||
    cartId === "null" ||
    cartId === "undefined"
  ) {

    cartId =
      "cart_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .substring(2, 10);

    localStorage.setItem(
      CART_ID_KEY,
      cartId
    );

    console.log(
      "🛒 NEW CART ID CREATED:",
      cartId
    );

  } else {

    console.log(
      "🛒 EXISTING CART ID:",
      cartId
    );

  }

  return cartId;
};


// =====================================================
// SAVE CART ID
// =====================================================

export const saveCartId = (cartId) => {

  if (
    !cartId ||
    cartId === "null" ||
    cartId === "undefined"
  ) {
    console.warn(
      "⚠️ Cannot save empty Cart ID"
    );

    return null;
  }

  localStorage.setItem(
    CART_ID_KEY,
    String(cartId)
  );

  console.log(
    "✅ CART ID SAVED:",
    cartId
  );

  return cartId;
};


// =====================================================
// REMOVE CART ID
// =====================================================

export const removeCartId = () => {

  localStorage.removeItem(
    CART_ID_KEY
  );

  console.log(
    "🗑️ CART ID REMOVED"
  );
};


// =====================================================
// CHECK CART ID
// =====================================================

export const hasCartId = () => {

  const cartId =
    localStorage.getItem(
      CART_ID_KEY
    );

  return !!(
    cartId &&
    cartId !== "null" &&
    cartId !== "undefined"
  );
};


// =====================================================
// EXPORT KEY
// =====================================================

export {
  CART_ID_KEY,
};