document.addEventListener("DOMContentLoaded", () => {
  // This script will only run on the product detail page.
  if (document.body.id === "product-page") {
    displayProductDetails();
  }
});

/**
 * Fetches and displays the details for a single product based on the ID in the URL.
 */
async function displayProductDetails() {
  const productDetailContainer = document.getElementById(
    "product-detail-content"
  );

  // Get the product ID from the URL query parameters (e.g., ?id=1)
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    productDetailContainer.innerHTML =
      "<p>Product not found. Please go back to the homepage.</p>";
    return;
  }

  try {
    const product = await getProductById(productId);

    // Set the page title to the product name
    document.title = `${product.name} - MyStore`;

    // Create the HTML for the product detail view
    productDetailContainer.innerHTML = `
            <div class="product-detail-container">
                <div class="product-detail-image">
                    <img src="${
                      product.imageUrl || "https://via.placeholder.com/400"
                    }" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <p>${product.description}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn" data-product-id="${
                      product.id
                    }">Add to Cart</button>
                </div>
            </div>
        `;

    // Add an event listener to the new "Add to Cart" button
    const addToCartButton =
      productDetailContainer.querySelector(".add-to-cart-btn");
    addToCartButton.addEventListener("click", () => {
      handleAddToCart(product.id); // This function is in cart.js
    });
  } catch (error) {
    console.error("Failed to display product details:", error);
    productDetailContainer.innerHTML =
      "<p>Error loading product details. It may not exist.</p>";
  }
}
