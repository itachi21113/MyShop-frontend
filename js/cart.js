// In MyShop-frontend/js/cart.js

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  if (document.body.id === "cart-page") {
    displayCartItems();
  }
});

async function updateCartCount() {
  const cartCountSpan = document.getElementById("cart-count");
  if (!localStorage.getItem("authToken")) {
    if (cartCountSpan) cartCountSpan.textContent = "0";
    return;
  }
  try {
    const cart = await getCart();
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountSpan) cartCountSpan.textContent = totalItems;
  } catch (error) {
    console.error("Failed to fetch cart count:", error);
    if (cartCountSpan) cartCountSpan.textContent = "0";
  }
}

async function handleAddToCart(productId) {
  if (!localStorage.getItem("authToken")) {
    alert("Please log in to add items to your cart.");
    window.location.href = "login.html";
    return;
  }
  try {
    await addToCart(productId, 1);
    alert("Item added to cart!");
    updateCartCount();
  } catch (error) {
    alert(`Error adding item to cart: ${error.message}`);
  }
}

async function displayCartItems() {
  const cartContainer = document.getElementById("cart-items-container");
  const cartTotalElement = document.getElementById("cart-total");
  const checkoutButton = document.querySelector(".checkout-btn");

  if (!cartContainer) return;

  try {
    const cart = await getCart();

    if (cart.items.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      if (checkoutButton) {
        checkoutButton.classList.add("hidden");
        checkoutButton.disabled = true;
      }
      cartTotalElement.textContent = "$0.00";
      return;
    } else {
      if (checkoutButton) {
        checkoutButton.classList.remove("hidden");
        checkoutButton.disabled = false;
      }
    }

    const productDetailPromises = cart.items.map((item) =>
      getProductById(item.productId)
    );
    const productDetails = await Promise.all(productDetailPromises);
    const enrichedCartItems = cart.items.map((item, index) => ({
      ...item,
      product: productDetails[index],
    }));

    let cartHTML = "";
    enrichedCartItems.forEach((item) => {
      cartHTML += createCartItem(item);
    });

    cartContainer.innerHTML = cartHTML;
    cartTotalElement.textContent = `$${cart.totalPrice.toFixed(2)}`;

    addRemoveButtonListeners();
  } catch (error) {
    console.error("Failed to display cart items:", error);
    cartContainer.innerHTML =
      "<p>Error loading your cart. Please try again later.</p>";
  }
}

function addRemoveButtonListeners() {
  const removeButtons = document.querySelectorAll(".remove-from-cart-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      const cartItemId = e.target.dataset.itemId;
      try {
        await removeFromCart(cartItemId);
        alert("Item removed from cart.");
        displayCartItems();
        updateCartCount();
      } catch (error) {
        alert(`Error removing item: ${error.message}`);
      }
    });
  });
}
