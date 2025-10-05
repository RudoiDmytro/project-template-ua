import { generateStars } from "../utils.js";
import { addToCart } from "../cart.js";
import { attachAddToCartListeners } from "../ui.js";

function attachReviewFormListeners() {
  const form = document.getElementById("addReviewForm");
  if (!form) return;

  const ratingValueInput = document.getElementById("ratingValue");
  const starRatingInput = document.querySelector(".star-rating-input");
  const stars = starRatingInput.querySelectorAll("i");
  const requiredInputs = form.querySelectorAll("[required]");
  let currentRating = 0;

  // --- Validation Helper Functions ---
  const showError = (el, message) => {
    const formGroup = el.closest(".form-group");
    const errorDiv = formGroup.querySelector(".error-message");
    errorDiv.textContent = message;
    formGroup.classList.add("has-error");
  };
  const hideError = (el) => {
    const formGroup = el.closest(".form-group");
    const errorDiv = formGroup.querySelector(".error-message");
    errorDiv.textContent = "";
    formGroup.classList.remove("has-error");
  };

  // --- Star Rating Logic ---
  const setStars = (rating) => {
    for (let s of stars) {
      s.classList.toggle("fas", Number.parseInt(s.dataset.value) <= rating);
      s.classList.toggle("far", Number.parseInt(s.dataset.value) > rating);
    }
  };

  for (let star of stars) {
    star.addEventListener("mouseover", () =>
      setStars(Number.parseInt(star.dataset.value))
    );
    star.addEventListener("mouseout", () => setStars(currentRating));
    star.addEventListener("click", () => {
      currentRating = Number.parseInt(star.dataset.value);
      ratingValueInput.value = currentRating;
      hideError(starRatingInput);
    });
  }

  // --- Real-time Input Validation ---
  for (let input of requiredInputs)
    input.addEventListener("input", () => {
      if (input.value.trim() !== "") hideError(input);
    });

  // --- Form Submission Logic ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isFormValid = true;

    for (let input of requiredInputs) {
      if (input.value.trim() === "") {
        showError(input, "This field is required.");
        isFormValid = false;
      } else if (
        input.type === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)
      ) {
        showError(input, "Please enter a valid email address.");
        isFormValid = false;
      } else {
        hideError(input);
      }
    }

    if (ratingValueInput.value === "0") {
      showError(starRatingInput, "Please select a rating.");
      isFormValid = false;
    }

    if (isFormValid) {
      alert("Thank you for your review!");
      form.reset();
      currentRating = 0;
      ratingValueInput.value = 0;
      setStars(0);
    }
  });
}

function attachProductPageListeners(product) {
  const quantityValue = document.getElementById("quantity-value");
  document.getElementById("increase-quantity").addEventListener("click", () => {
    quantityValue.textContent = Number.parseInt(quantityValue.textContent) + 1;
  });
  document.getElementById("decrease-quantity").addEventListener("click", () => {
    let currentVal = Number.parseInt(quantityValue.textContent);
    if (currentVal > 1) {
      quantityValue.textContent = currentVal - 1;
    }
  });

  const button = document.getElementById("add-to-cart-details");
  document
    .getElementById("add-to-cart-details")
    .addEventListener("click", () => {
      const quantity = Number.parseInt(quantityValue.textContent);
      addToCart(product, quantity);
      button.textContent = "Added!";
      button.disabled = true;
      setTimeout(() => {
        button.textContent = "Add To Cart";
      }, 2000);
    });

  // Tab functionality
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");
  for (let link of tabLinks) {
    link.addEventListener("click", () => {
      for (let l of tabLinks) l.classList.remove("active");
      for (let c of tabContents) c.classList.remove("active");

      link.classList.add("active");
      document.getElementById(link.dataset.tab).classList.add("active");
    });
  }

  const mainImage = document.getElementById("main-product-image");
  const thumbnails = document.querySelectorAll(".thumbnail");

  for (let thumb of thumbnails) {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;

      for (let t of thumbnails) t.classList.remove("active");
      thumb.classList.add("active");
    });
  }

  if (typeof attachAddToCartListeners === "function") {
    attachAddToCartListeners();
  }
  attachReviewFormListeners();
}

function renderProductDetails(product, allProducts) {
  const mainContent = document.getElementById("product-details-page");

  document.title = `${product.name} - Best Shop`;
  const galleryImages = [
    product.imageUrl,
    "/assets/product-image-placeholder-1.png",
    "/assets/product-image-placeholder-2.png",
    "/assets/product-image-placeholder-3.png",
  ];

  const youMayAlsoLike = allProducts
    .filter((p) => p.id !== product.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const stars =
    typeof generateStars === "function" ? generateStars(product.rating) : "";

  mainContent.innerHTML = `
        <div class="product-details-section">
            <div class="container product-layout">
                <div class="product-gallery">
                    <img src="${product.imageUrl}" alt="${
    product.name
  }" id="main-product-image" class="main-image">
                    <div class="thumbnail-images">
                        ${galleryImages
                          .map(
                            (imgSrc, index) => `
                            <img src="${imgSrc}" alt="${
                              product.name
                            } thumbnail ${index + 1}" class="thumbnail ${
                              index === 0 ? "active" : ""
                            }">
                        `
                          )
                          .join("")}
                    </div>
                </div>

                <div class="product-info-main">
                    <h1>${product.name}</h1>
                    <div class="product-meta-details">
                        <span class="price">$${product.price.toFixed(2)}</span>
                        <div class="rating">${stars} (1 Review)</div>
                    </div>
                    <p class="description">${
                      product.description || "No description available."
                    }</p>
                    
                    <div class="product-options">
                        <div class="option-group">
                            <label for="size-select">Size:</label>
                            <select id="size-select"><option>${
                              product.size
                            }</option></select>
                        </div>
                        <div class="option-group">
                            <label for="color-select">Color:</label>
                            <select id="color-select"><option>${
                              product.color
                            }</option></select>
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <div class="quantity-control">
                            <button id="decrease-quantity">-</button>
                            <span id="quantity-value">1</span>
                            <button id="increase-quantity">+</button>
                        </div>
                        <button id="add-to-cart-details" class="button primary">Add To Cart</button>
                    </div>

                    <div class="payment-methods">
                        <p>Payment: <i class="fab fa-cc-visa"></i> <i class="fab fa-cc-mastercard"></i> <i class="fab fa-cc-paypal"></i></p>
                    </div>
                </div>
            </div>
        </div>

        <div class="product-tabs-section">
            <div class="container">
                <div class="tab-nav">
                    <button class="tab-link active" data-tab="details">Details</button>
                    <button class="tab-link" data-tab="reviews">Reviews</button>
                    <button class="tab-link" data-tab="shipping">Shipping Policy</button>
                </div>
                <div id="details" class="tab-content active">
                    <h3>Product Details</h3>
                    <p>${
                      product.description ||
                      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos."
                    }</p>
                    <ul>
                        ${
                          product.features
                            ? product.features
                                .map((f) => `<li>${f}</li>`)
                                .join("")
                            : ""
                        }
                    </ul>
                </div>
                  <div id="reviews" class="tab-content">
                    <div class="reviews-layout">
                        <div class="reviews-list">
                            <h3>1 review for ${product.name}</h3>
                            <div class="review-item">
                                <div class="review-header">
                                    <img src="/assets/customer-4.png" alt="Ella Harper" class="review-avatar">
                                    <div class="review-meta">
                                        <span class="review-author">Ella Harper</span>
                                        <span class="review-date">/ June 11, 2025</span>
                                    </div>
                                </div>
                                <div class="review-rating">${generateStars(
                                  4
                                )}</div>
                                <p class="review-body">Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse potenti curabitur ac placerat est, sit amet sodales risus.</p>
                            </div>
                        </div>
                        <div class="review-form">
                            <h3>Add Review</h3>
                            <p class="form-note">Your email address won’t be shared with anybody. Required fields have the symbol *</p>
                            <form id="addReviewForm" novalidate>
                                <div class="form-group rating-group">
                                    <label>Rate Product</label>
                                    <div class="star-rating-input">
                                        <i class="far fa-star" data-value="1" title="Poor"></i>
                                        <i class="far fa-star" data-value="2" title="Fair"></i>
                                        <i class="far fa-star" data-value="3" title="Average"></i>
                                        <i class="far fa-star" data-value="4" title="Good"></i>
                                        <i class="far fa-star" data-value="5" title="Excellent"></i>
                                        <input type="hidden" name="rating" id="ratingValue" value="0">
                                    </div>
                                    <div class="error-message"></div>
                                </div>
                                <div class="form-group">
                                    <label for="reviewText">Your Review *</label>
                                    <textarea id="reviewText" name="reviewText" rows="5" required></textarea>
                                    <div class="error-message"></div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="reviewerName">Your Name *</label>
                                        <input type="text" id="reviewerName" name="reviewerName" required>
                                        <div class="error-message"></div>
                                    </div>
                                    <div class="form-group">
                                        <label for="reviewerEmail">Your Email *</label>
                                        <input type="email" id="reviewerEmail" name="reviewerEmail" required>
                                        <div class="error-message"></div>
                                    </div>
                                </div>
                                <div class="form-group checkbox-group">
                                    <input type="checkbox" id="saveInfo" name="saveInfo">
                                    <label for="saveInfo">Save my name, email, and website in this browser for when I leave another comment.</label>
                                    <div class="error-message"></div>
                                </div>
                                <button id="review-button" type="submit" class="button primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div id="shipping" class="tab-content">
                    <h3>Shipping Policy</h3>
                    <p>We offer worldwide shipping. Standard shipping takes 5-7 business days. Express options are available at checkout.</p>
                </div>
            </div>
        </div>
        
        <section class="products-section you-may-also-like">
            <div class="container">
                <h2>You May Also Like</h2>
                <div class="product-grid">
                    ${youMayAlsoLike
                      .map((p) => {
                        const salesBadge = p.salesStatus
                          ? '<span class="product-sales-badge">Sale!</span>'
                          : "";
                        return `
                        <article class="product-card">
                            <div class="product-image-wrapper">
                                <a href="/pages/product-details-template.html?id=${
                                  p.id
                                }" class="product-link">
                                    <img src="${p.imageUrl}" alt="${
                          p.name
                        }" class="product-image" loading="lazy">
                                </a>
                                ${salesBadge}
                            </div>
                            <div class="product-info">
                                <a href="/pages/product-details-template.html?id=${
                                  p.id
                                }" class="product-link"><h3 class="product-name">${
                          p.name
                        }</h3></a>
                                <div class="product-meta">
                                    <span class="product-price">$${p.price.toFixed(
                                      2
                                    )}</span>
                                </div>
                                <button class="button primary add-to-cart-button" data-id="${
                                  p.id
                                }" data-name="${p.name}" data-price="${
                          p.price
                        }" data-image="${p.imageUrl}">Add to Cart</button>
                            </div>
                        </article>`;
                      })
                      .join("")}
                </div>
            </div>
        </section>
        `;

  attachProductPageListeners(product);
}

export default async function initializeProductDetailsPage() {
  const mainContent = document.getElementById("product-details-page");
  const params = new URLSearchParams(globalThis.location.search);
  const productId = params.get("id");

  if (!productId) {
    mainContent.innerHTML =
      '<div class="container"><p>Product ID not found.</p></div>';
    return;
  }

  if (!productId) {
    mainContent.innerHTML =
      '<div class="container"><p>Product ID not found.</p></div>';
    return;
  }

  try {
    const response = await fetch("/assets/data.json");
    const data = await response.json();
    const allProducts = data.data;
    const product = allProducts.find((p) => p.id === productId);

    if (!product) {
      mainContent.innerHTML =
        '<div class="container"><p>Product not found.</p></div>';
      return;
    }

    renderProductDetails(product, allProducts);
  } catch (error) {
    console.error("Error loading product details:", error);
    mainContent.innerHTML =
      '<div class="container"><p>Could not load product details.</p></div>';
  }
}
