document.addEventListener("DOMContentLoaded", () => {
  // This block will only run if we are on the homepage (index.html).
  // It checks for the existence of the product grid element.
  if (document.getElementById("product-grid")) {
    displayProducts();
  }
});

/**
 * Fetches all products from the API and displays them in the product grid.
 */
async function displayProducts() {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return; // Exit if the grid element isn't on the page

  try {
    const products = await getAllProducts();

    if (products.length === 0) {
      productGrid.innerHTML = "<p>No products found.</p>";
      return;
    }

    // Use the createProductCard component to generate HTML for each product
    productGrid.innerHTML = products.map(createProductCard).join("");

    // After creating the cards, add event listeners to the new buttons
    addCartButtonListeners();
  } catch (error) {
    console.error("Failed to display products:", error);
    productGrid.innerHTML =
      "<p>There was an error loading products. Please try refreshing the page.</p>";
  }
}

/**
 * Adds click event listeners to all "Add to Cart" buttons on the page.
 */
function addCartButtonListeners() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.productId;
      handleAddToCart(productId); // This function is in cart.js
    });
  });
}
