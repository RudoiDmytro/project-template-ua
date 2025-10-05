/**
 * Generates the HTML for a star rating display.
 * @param {number} rating - The numerical rating (e.g., 4.5).
 * @returns {string} HTML string of star icons.
 */
export function generateStars(rating) {
  let starsHtml = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  for (let i = 0; i < fullStars; i++)
    starsHtml += '<i class="fas fa-star"></i>';
  if (hasHalfStar) starsHtml += '<i class="fas fa-star-half-alt"></i>';
  for (let i = 0; i < 5 - Math.ceil(rating); i++)
    starsHtml += '<i class="far fa-star"></i>';
  return starsHtml;
}

/**
 * Asynchronously loads HTML content from a file into a specified element.
 * @param {string} elementId - The ID of the element to inject HTML into.
 * @param {string} filePath - The path to the HTML file to load.
 */
export async function loadHTML(elementId, filePath) {
  try {
    const response = await fetch(`${filePath}`); 
    if (!response.ok) throw new Error(`Failed to fetch ${filePath}`);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}
