/**
 * Creates the HTML for a single product card.
 * @param {object} product - The product object from the API.
 * @returns {string} The HTML string for the product card.
 */
function createProductCard(product) {
  return `
        <div class="product-card">
            <a href="product.html?id=${product.id}">
                <img src="${
                  product.imageUrl || "https://via.placeholder.com/300"
                }" alt="${product.name}">
            </a>
            <div class="card-content">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-product-id="${
                  product.id
                }">Add to Cart</button>
            </div>
        </div>
    `;
}

/**
 * Creates the HTML for a single item in the shopping cart.
 * @param {object} item - The cart item object from the API.
 * @returns {string} The HTML string for the cart item.
 */
function createCartItem(item) {
  return `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="cart-item-info">
                <img src="${
                  item.product.imageUrl || "https://via.placeholder.com/80"
                }" alt="${item.product.name}">
                <div>
                    <h4>${item.product.name}</h4>
                    <p>$${item.product.price.toFixed(2)} x ${item.quantity}</p>
                </div>
            </div>
            <div class="cart-item-controls">
                <button class="remove-from-cart-btn" data-item-id="${
                  item.id
                }">Remove</button>
            </div>
        </div>
    `;
}
