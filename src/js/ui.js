import { addToCart } from "./cart.js";

/**
 * Attaches event listeners to all "Add to Cart" buttons on the page.
 */
export function attachAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
  addToCartButtons.forEach((button) => {
    if (button.dataset.listenerAttached) return;

    button.addEventListener("click", (event) => {
      const product = {
        id: event.currentTarget.dataset.id,
        name: event.currentTarget.dataset.name,
        price: parseFloat(event.currentTarget.dataset.price),
        imageUrl: event.currentTarget.dataset.image,
      };
      addToCart(product);

      const originalText = button.textContent;
      button.textContent = "Added!";
      button.disabled = true;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1500);
    });
    button.dataset.listenerAttached = "true";
  });
}

/**
 * Initializes the login modal functionality.
 */
export function initializeModal() {
  const accountIcon = document.querySelector(".account-icon");
  const loginModal = document.getElementById("loginModal");
  const closeButton = loginModal
    ? loginModal.querySelector(".close-button")
    : null;
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");

  if (accountIcon) {
    accountIcon.addEventListener("click", () => {
      if (loginModal) loginModal.style.display = "block";
    });
  }
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      if (loginModal) loginModal.style.display = "none";
    });
  }
  window.addEventListener("click", (event) => {
    if (event.target == loginModal) {
      loginModal.style.display = "none";
    }
  });

  if (loginEmail) {
    loginEmail.addEventListener("input", () => {
      if (loginEmail.validity.valid) {
        emailError.textContent = "";
      } else if (loginEmail.validity.typeMismatch) {
        emailError.textContent = "Please enter a valid email address.";
      } else {
        emailError.textContent = "Email is required.";
      }
    });
  }

  if (loginPassword) {
    loginPassword.addEventListener("input", () => {
      if (loginPassword.validity.valid) {
        passwordError.textContent = "";
      } else {
        passwordError.textContent = "Password is required.";
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      let isValid = true;

      if (!loginEmail.validity.valid) {
        emailError.textContent = loginEmail.validity.typeMismatch
          ? "Please enter a valid email address."
          : "Email is required.";
        isValid = false;
      } else {
        emailError.textContent = "";
      }

      if (!loginPassword.value.trim()) {
        passwordError.textContent = "Password is required.";
        isValid = false;
      } else {
        passwordError.textContent = "";
      }

      if (isValid) {
        alert(
          "Login successful! (This is a placeholder for actual login logic)"
        );
        loginModal.style.display = "none";
        loginForm.reset();
      }
    });
  }

  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      const passwordInput = document.getElementById(targetId);
      const icon = button.querySelector("i");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  });
}
