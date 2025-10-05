import { attachAddToCartListeners } from "../ui.js";
import { generateStars } from "../utils.js";

/**
 * A reusable class to create a smooth, infinite, auto-scrolling carousel.
 */
class AutoCarousel {
  constructor(carouselElement) {
    this.wrapper = carouselElement;
    this.track = carouselElement.querySelector(".carousel-track");
    this.items = [...this.track.children];

    if (this.items.length === 0) return;

    this.setupCarousel();
  }

  setupCarousel() {
    const container = this.wrapper.querySelector(".carousel-container");
    const containerWidth = container.offsetWidth;

    let trackWidth = this.items.reduce((w, item) => w + item.offsetWidth, 0);

    while (trackWidth < containerWidth * 2) {
      const clones = this.items.map((item) => item.cloneNode(true));
      this.track.append(...clones);
      trackWidth *= 2;
    }

    const track2 = this.track.cloneNode(true);
    this.track.parentNode.append(track2);

    const scrollDistance = this.track.offsetWidth;
    const animationDuration = scrollDistance / 100;

    this.track.style.animation = `scroll ${animationDuration}s linear infinite`;
    track2.style.animation = `scroll ${animationDuration}s linear infinite`;

    this.wrapper.style.setProperty("--scroll-end", `-${scrollDistance}px`);
  }
}

/**
 * Main function to load products and initialize carousels.
 */
async function loadHomepageCarousels() {
  try {
    const response = await fetch("assets/data.json");
    const data = await response.json();

    const selectedProducts = data.data.filter((p) =>
      p.blocks?.includes("Selected Products")
    );
    const newProducts = data.data.filter((p) =>
      p.blocks?.includes("New Products Arrival")
    );

    const selectedCarouselTrack = document.getElementById(
      "selected-products-grid"
    );
    const newCarouselTrack = document.getElementById("new-products-grid");

    if (selectedCarouselTrack) {
      selectedCarouselTrack.innerHTML = selectedProducts
        .map(createProductCardHTML)
        .join("");
      new AutoCarousel(
        document.querySelector(".selected-products .carousel-wrapper")
      );
    }

    if (newCarouselTrack) {
      newCarouselTrack.innerHTML = newProducts
        .map(createProductCardHTML)
        .join("");
      new AutoCarousel(
        document.querySelector(".new-products-arrival .carousel-wrapper")
      );
    }
    attachAddToCartListeners();
  } catch (error) {
    console.error("Error loading homepage carousels:", error);
  }
}

/**
 * Creates the HTML string for a single product card.
 */
function createProductCardHTML(product) {
  const salesBadge = product.salesStatus
    ? '<span class="product-sales-badge">SALE!</span>'
    : "";
  return `
        <article class="product-card">
                <div class="product-image-wrapper"><a href="/pages/product-details-template.html?id=${
                  product.id
                }"><img src="${product.imageUrl}" alt="${
    product.name
  }" class="product-image" loading="lazy"></a>${salesBadge}</div>
                <div class="product-info">
                    <div><a href="/pages/product-details-template.html?id=${
                      product.id
                    }"><h3 class="product-name">${
    product.name
  }</h3></a><div class="product-rating">${generateStars(
    product.rating
  )}</div><p class="product-price">$${product.price.toFixed(2)}</p></div>
                    <button class="button primary add-to-cart-button" data-id="${
                      product.id
                    }" data-name="${product.name}" data-price="${
    product.price
  }" data-image="${product.imageUrl}">Add To Cart</button>
                </div>
            </article>`;
}

/**
 * Initializes all functionality for the homepage.
 */
export default function initializeHomePage() {
  loadHomepageCarousels();
}
