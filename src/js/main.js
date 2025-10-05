import { loadHTML } from "./utils.js";
import { updateCartCounter } from "./cart.js";
import { initializeModal } from "./ui.js";

import initializeHomePage from "./pages/home.js";
import initializeCatalogPage from "./pages/catalog.js";
import initializeProductDetailsPage from "./pages/product-details.js";
import initializeCartPage from "./pages/cart-page.js";
import initializeContactPage from "./pages/contact.js";

/**
 * The main function to run when the DOM is ready.
 */
async function main() {
  await loadHTML("header-placeholder", "/components/header.html");
  await loadHTML("footer-placeholder", "/components/footer.html");

  initializeModal();
  updateCartCounter(); 

  if (document.getElementById("selected-products-grid")) {
    initializeHomePage();
  }
  if (document.getElementById("catalog-product-grid")) {
    initializeCatalogPage();
  }
  if (document.getElementById("product-details-page")) {
    initializeProductDetailsPage();
  }
  if (document.getElementById("cart-container")) {
    initializeCartPage();
  }
  if (document.getElementById("contactForm")) {
    initializeContactPage();
  }
}

document.addEventListener("DOMContentLoaded", main);
