import { generateStars } from "../utils.js";
import { attachAddToCartListeners } from "../ui.js";

/**
 * Loads products from JSON and renders them into the homepage sections.
 */
async function loadHomepageProducts() {
  try {
    const response = await fetch("assets/data.json");
    const data = await response.json();
    const products = data.data;

    const selectedProductsGrid = document.getElementById(
      "selected-products-grid"
    );
    const newProductsGrid = document.getElementById("new-products-grid");

    if (selectedProductsGrid) selectedProductsGrid.innerHTML = "";
    if (newProductsGrid) newProductsGrid.innerHTML = "";

    products.forEach((product) => {
      const isSelected = product.blocks?.includes("Selected Products");
      const isNew = product.blocks?.includes("New Products Arrival");

      if (isSelected || isNew) {
        const productCard = createProductCard(product);
        if (isSelected && selectedProductsGrid) {
          selectedProductsGrid.appendChild(productCard.cloneNode(true));
        }
        if (isNew && newProductsGrid) {
          newProductsGrid.appendChild(productCard.cloneNode(true));
        }
      }
    });

    attachAddToCartListeners();
  } catch (error) {
    console.error("Error loading homepage products:", error);
  }
}

/**
 * Creates the HTML element for a single product card.
 * @param {object} product - The product data.
 * @returns {HTMLElement} The created article element.
 */
function createProductCard(product) {
  const productCard = document.createElement("article");
  productCard.classList.add("product-card");

  const salesBadge = product.salesStatus
    ? '<span class="product-sales-badge">SALE!</span>'
    : "";

  productCard.innerHTML = `
        <div class="product-image-wrapper">
            <a href="/pages/product-details-template.html?id=${
              product.id
            }" class="product-link">
                <img src="${product.imageUrl}" alt="${
    product.name
  }" class="product-image" loading="lazy">
            </a>
            ${salesBadge}
        </div>
        <div class="product-info">
            <div>
                <a href="/pages/product-details-template.html?id=${
                  product.id
                }" class="product-link">
                    <h3 class="product-name">${product.name}</h3>
                </a>
                <div class="product-rating">${generateStars(
                  product.rating
                )}</div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
            <button class="button primary add-to-cart-button" data-id="${
              product.id
            }" data-name="${product.name}" data-price="${
    product.price
  }" data-image="${product.imageUrl}">Add to Cart</button>
        </div>
    `;
  return productCard;
}

/**
 * Initializes all functionality for the homepage.
 */
export default function initializeHomePage() {
  loadHomepageProducts();
}
