import { updateCartCounter } from "../cart.js";

let cartContainer, emptyCartMessage;

function updateCart(id, newQuantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemIndex = cart.findIndex((item) => item.id === id);

  if (itemIndex > -1) {
    if (newQuantity > 0) {
      cart[itemIndex].quantity = newQuantity;
    } else {
      cart.splice(itemIndex, 1);
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCounter();
}

function attachCartEventListeners() {
  cartContainer.addEventListener("click", (e) => {
    const target = e.target;
    const itemRow = target.closest("tr");

    if (target.matches(".quantity-btn, .quantity-btn *")) {
      const id = itemRow.dataset.id;
      let quantity = Number.parseInt(
        itemRow.querySelector(".quantity-value").textContent
      );
      if (target.dataset.action === "increase") quantity++;
      else if (target.dataset.action === "decrease") quantity--;
      updateCart(id, quantity);
    }

    if (target.matches(".remove-item-btn, .remove-item-btn *")) {
      updateCart(itemRow.dataset.id, 0);
    }

    if (target.matches(".clear-cart-btn, .clear-cart-btn *")) {
      localStorage.removeItem("cart");
      renderCart();
      updateCartCounter();
    }

    if (target.matches(".checkout-btn, .checkout-btn *")) {
      alert("Thank you for your purchase!");
      localStorage.removeItem("cart");
      renderCart();
      updateCartCounter();
    }
  });
}

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    if (cartContainer) cartContainer.innerHTML = "";
    if (emptyCartMessage) emptyCartMessage.style.display = "block";
    return;
  }

  if (emptyCartMessage) emptyCartMessage.style.display = "none";

  let subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 30;
  const discount = subTotal >= 3000 ? subTotal * 0.1 : 0;
  const total = subTotal - discount + shipping;

  const cartHTML = `
        <table class="cart-table">
            <thead><tr><th>Image</th><th>Product Name</th><th>Price</th><th>Quantity</th><th>Total</th><th>Delete</th></tr></thead>
            <tbody>${cart
              .map(
                (item) => `
                <tr data-id="${item.id}">
                    <td><img src="${item.image}" alt="${
                  item.name
                }" class="cart-item-image"></td>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <div class="quantity-control">
                            <button class="quantity-btn" data-action="decrease">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" data-action="increase">+</button>
                        </div>
                    </td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                    <td><button class="icon-button remove-item-btn"><i class="fas fa-trash-alt"></i></button></td>
                </tr>`
              )
              .join("")}
            </tbody>
        </table>
        <div class="cart-summary">
            <div class="cart-actions">
                <a href="catalog.html" class="button secondary">Continue Shopping</a>
                <button class="button secondary clear-cart-btn">Clear Shopping Cart</button>
            </div>
            <div class="cart-totals">
                <div class="total-row"><span>Sub Total</span><span>$${subTotal.toFixed(
                  2
                )}</span></div>
                <div class="total-row"><span>Discount</span><span>$${discount.toFixed(
                  2
                )}</span></div>
                <div class="total-row"><span>Shipping</span><span>$${shipping.toFixed(
                  2
                )}</span></div>
                <div class="total-row grand-total"><span>Total</span><span>$${total.toFixed(
                  2
                )}</span></div>
                <button class="button primary checkout-btn">Checkout</button>
            </div>
        </div>`;

  if (cartContainer) {
    cartContainer.innerHTML = cartHTML;
    attachCartEventListeners();
  }
}

/**
 * Initializes all functionality for the cart page.
 */
export default function initializeCartPage() {
  cartContainer = document.getElementById("cart-container");
  emptyCartMessage = document.querySelector(".cart-empty-message");
  renderCart();
}
