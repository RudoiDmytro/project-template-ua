/**
 * Initializes all functionality for the contact page.
 */
export default function initializeContactPage() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const formStatus = document.getElementById("form-status");
  const requiredInputs = contactForm.querySelectorAll("[required]");

  const showError = (input, message) => {
    const errorDiv = input.nextElementSibling;
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
  };

  const hideError = (input) => {
    const errorDiv = input.nextElementSibling;
    errorDiv.textContent = "";
    errorDiv.style.display = "none";
  };

  const validateInput = (input) => {
    if (
      input.type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())
    ) {
      showError(input, "Please enter a valid email address.");
      return false;
    }
    if (input.value.trim() === "") {
      showError(input, "This field is required.");
      return false;
    }
    hideError(input);
    return true;
  };

  requiredInputs.forEach((input) => {
    input.addEventListener("input", () => validateInput(input));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let isFormValid = true;
    requiredInputs.forEach((input) => {
      if (!validateInput(input)) isFormValid = false;
    });

    formStatus.textContent = "";
    if (isFormValid) {
      alert("Message sent successfully!");
      contactForm.reset();
    } else {
      formStatus.textContent = "Please correct the errors above.";
      formStatus.style.color = "#dc3545";
    }
  });
}
