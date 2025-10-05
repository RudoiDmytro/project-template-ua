import { generateStars } from "../utils.js";
import { attachAddToCartListeners } from "../ui.js";

const FilterComponent = (function () {
  const filterBar = document.getElementById("filter-bar");
  const toggleFiltersBtn = document.getElementById("toggle-filters-btn");
  const hideFiltersBtn = document.getElementById("hide-filters-btn");
  const clearFiltersBtn = document.getElementById("clear-filters-btn");
  const sizeFilter = document.getElementById("size-filter");
  const colorFilter = document.getElementById("color-filter");
  const categoryFilter = document.getElementById("category-filter");
  const salesFilter = document.getElementById("sales-filter");

  let onFilterChangeCallback = () => {};

  function populateDropdowns(products) {
    const categories = [...new Set(products.map((p) => p.category))];
    const colors = [...new Set(products.map((p) => p.color))];
    const sizes = [
      ...new Set(
        products.flatMap((p) => p.size.split(",").map((s) => s.trim()))
      ),
    ].sort((a, b) => a.size - b.size);

    categoryFilter.innerHTML += categories
      .map(
        (c) =>
          `<option value="${c}">${
            c.charAt(0).toUpperCase() + c.slice(1)
          }</option>`
      )
      .join("");
    colorFilter.innerHTML += colors
      .map(
        (c) =>
          `<option value="${c}">${
            c.charAt(0).toUpperCase() + c.slice(1)
          }</option>`
      )
      .join("");
    sizeFilter.innerHTML += sizes
      .map((s) => `<option value="${s}">${s}</option>`)
      .join("");
  }

  function updateVisualHighlights() {
    for (let select of [sizeFilter, colorFilter, categoryFilter])
      select
        .closest(".filter-group")
        .classList.toggle("filter-active", !!select.value);

    salesFilter
      .closest(".filter-group")
      .classList.toggle("filter-active", salesFilter.checked);
  }

  function handleFilterChange() {
    updateVisualHighlights();
    onFilterChangeCallback();
  }

  function clearFilters() {
    sizeFilter.value = "";
    colorFilter.value = "";
    categoryFilter.value = "";
    salesFilter.checked = false;
    handleFilterChange();
  }

  function attachEventListeners() {
    toggleFiltersBtn.addEventListener("click", () =>
      filterBar.classList.toggle("active")
    );
    hideFiltersBtn.addEventListener("click", () =>
      filterBar.classList.remove("active")
    );
    clearFiltersBtn.addEventListener("click", clearFilters);

    for (let el of [sizeFilter, colorFilter, categoryFilter, salesFilter])
      el.addEventListener("change", handleFilterChange);
  }

  return {
    /**
     * Initializes the filter component.
     * @param {Array} allProducts - The full list of products.
     * @param {Function} callback - The function to call when filters change.
     */
    init: function (allProducts, callback) {
      onFilterChangeCallback = callback;
      populateDropdowns(allProducts);
      attachEventListeners();
    },
    /**
     * Returns the current state of all filters.
     * @returns {object} The current filter values.
     */
    getFilters: function () {
      return {
        size: sizeFilter.value,
        color: colorFilter.value,
        category: categoryFilter.value,
        salesStatus: salesFilter.checked,
      };
    },
  };
})();

let allProducts = [];
const state = {
  products: [],
  currentPage: 1,
  productsPerPage: 12,
  query: "",
  sortBy: "popularity",
};

// DOM Elements
let productGrid,
  resultsCount,
  paginationControls,
  notFoundMessage,
  sortDropdown,
  searchForm,
  searchInput,
  topProductsWidget;

function renderTopProducts() {
  const topProducts = [...allProducts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  topProductsWidget.innerHTML = topProducts
    .map(
      (product) => `
        <div class="top-product-item">
            <a href="/pages/product-details-template.html?id=${
              product.id
            }"><img src="${product.imageUrl}" alt="${product.name}"></a>
            <div class="top-product-info">
                <a href="/pages/product-details-template.html?id=${
                  product.id
                }" class="top-product-name">${product.name}</a>
                <div class="top-product-rating">${generateStars(
                  product.rating
                )}</div>
                <p class="top-product-price">$${product.price.toFixed(2)}</p>
            </div>
        </div>`
    )
    .join("");
}

function renderPagination(totalProducts) {
  const totalPages = Math.ceil(totalProducts / state.productsPerPage);
  paginationControls.innerHTML = "";
  if (totalPages <= 1) return;

  const prevButtonHTML = `<li class="page-item"><a href="#" class="page-link prev ${
    state.currentPage === 1 ? "disabled" : ""
  }" data-page="${
    state.currentPage - 1
  }"><i class="fas fa-chevron-left"></i> PREV</a></li>`;
  let pageNumbersHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    pageNumbersHTML += `<li class="page-item"><a href="#" class="page-link page-number ${
      i === state.currentPage ? "active" : ""
    }" data-page="${i}">${i}</a></li>`;
  }
  const nextButtonHTML = `<li class="page-item"><a href="#" class="page-link next ${
    state.currentPage === totalPages ? "disabled" : ""
  }" data-page="${
    state.currentPage + 1
  }">NEXT <i class="fas fa-chevron-right"></i></a></li>`;
  paginationControls.innerHTML = `${prevButtonHTML}<div class="pagination-numbers">${pageNumbersHTML}</div>${nextButtonHTML}`;
}

function applyFiltersAndSort() {
  let processedProducts = allProducts;
  const currentFilters = FilterComponent.getFilters();

  if (state.query) {
    processedProducts = processedProducts.filter((p) =>
      p.name.toLowerCase().includes(state.query.toLowerCase())
    );
  }
  if (currentFilters.category) {
    processedProducts = processedProducts.filter(
      (p) => p.category === currentFilters.category
    );
  }
  if (currentFilters.color) {
    processedProducts = processedProducts.filter(
      (p) => p.color === currentFilters.color
    );
  }
  if (currentFilters.size) {
    processedProducts = processedProducts.filter((p) =>
      p.size
        .split(",")
        .map((s) => s.trim())
        .includes(currentFilters.size)
    );
  }
  if (currentFilters.salesStatus) {
    processedProducts = processedProducts.filter((p) => p.salesStatus === true);
  }

  switch (state.sortBy) {
    case "rating":
      processedProducts.sort((a, b) => b.rating - a.rating);
      break;
    case "price-asc":
      processedProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      processedProducts.sort((a, b) => b.price - a.price);
      break;
    default:
      processedProducts.sort((a, b) => b.popularity - a.popularity);
      break;
  }
  state.products = processedProducts;
}

function render() {
  applyFiltersAndSort();
  const totalProducts = state.products.length;
  notFoundMessage.style.display = totalProducts === 0 ? "block" : "none";
  const startIndex = (state.currentPage - 1) * state.productsPerPage;
  const endIndex = startIndex + state.productsPerPage;
  const pageProducts = state.products.slice(startIndex, endIndex);

  productGrid.innerHTML = pageProducts
    .map((product) => {
      const salesBadge = product.salesStatus
        ? '<span class="product-sales-badge">SALE</span>'
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
    })
    .join("");

  const showingStart = totalProducts > 0 ? startIndex + 1 : 0;
  const showingEnd = Math.min(endIndex, totalProducts);
  resultsCount.textContent = `Showing ${showingStart}–${showingEnd} of ${totalProducts} Results`;

  renderPagination(totalProducts);
  attachAddToCartListeners();
}

function addEventListeners() {
  searchInput.addEventListener("input", () => {
    state.query = searchInput.value.trim();
    state.currentPage = 1;
    render();
  });

  searchForm.addEventListener("submit", (e) => e.preventDefault());

  sortDropdown.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    render();
  });

  paginationControls.addEventListener("click", (e) => {
    e.preventDefault();
    const link = e.target.closest(".page-link");
    if (link && !link.classList.contains("disabled")) {
      state.currentPage = Number.parseInt(link.dataset.page);
      render();
      globalThis.scrollTo(0, 0);
    }
  });
}

/**
 * Initializes all functionality for the catalog page.
 */
export default async function initializeCatalogPage() {
  // Assign DOM elements
  productGrid = document.getElementById("catalog-product-grid");
  resultsCount = document.getElementById("results-count");
  paginationControls = document.getElementById("pagination-controls");
  notFoundMessage = document.getElementById("product-not-found");
  sortDropdown = document.getElementById("sort-by");
  searchForm = document.getElementById("search-form");
  searchInput = document.getElementById("search-input");
  topProductsWidget = document.getElementById("top-products-widget");

  try {
    const response = await fetch("/assets/data.json");
    const data = await response.json();
    allProducts = data.data;
    state.products = allProducts;

    FilterComponent.init(allProducts, () => {
      state.currentPage = 1;
      render();
    });

    render();
    renderTopProducts();
    addEventListeners();
  } catch (error) {
    console.error("Failed to load catalog products:", error);
  }
}
