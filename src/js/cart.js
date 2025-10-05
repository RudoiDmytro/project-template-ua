/**
 * Updates the cart counter in the header.
 */
export function updateCartCounter() {
  const cartCounter = document.querySelector(".cart-counter");
  if (!cartCounter) return;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounter.textContent = totalItems;
  cartCounter.style.display = totalItems > 0 ? "flex" : "none";
}

/**
 * Adds a product to the cart in localStorage.
 * @param {object} product - The product object to add.
 * @param {number} quantity - The quantity to add.
 */
export function addToCart(product, quantity = 1) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItemIndex = cart.findIndex((item) => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
}
