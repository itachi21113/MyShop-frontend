// Replace the entire content of MyShop-frontend/js/profile.js with this

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("authToken")) {
    window.location.href = "login.html";
    return;
  }

  // Check for the success query parameter from the checkout page
  checkForPaymentSuccess();

  displayUserProfile();
  displayOrderHistory();
});

/**
 * Checks the URL for a payment success flag and displays a message.
 */
function checkForPaymentSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const successMessageContainer = document.getElementById(
    "success-message-container"
  );

  if (urlParams.get("payment") === "success") {
    successMessageContainer.innerHTML = `
      <div class="success-message">
        Your payment was successful! Your order is being processed.
      </div>
    `;
    // Clean the URL so the message doesn't appear on refresh
    window.history.replaceState({}, document.title, "/profile.html");
  }
}

/**
 * Fetches the current user's data and displays it on the page.
 */
async function displayUserProfile() {
  const profileInfoContainer = document.getElementById("profile-info");
  if (!profileInfoContainer) return;

  try {
    // Get user info directly from the JWT to avoid a failing API call
    const token = localStorage.getItem("authToken");
    const user = decodeJwt(token); // Assumes decodeJwt is in auth.js

    profileInfoContainer.innerHTML = `
      <p><strong>Email:</strong> ${user.sub}</p>
    `;
  } catch (error) {
    console.error("Failed to load user profile:", error);
    profileInfoContainer.innerHTML =
      "<p>Error loading profile. Please try again.</p>";
  }
}

/**
 * Fetches the user's order history and displays it.
 */
async function displayOrderHistory() {
  const orderHistoryContainer = document.getElementById("order-history");
  if (!orderHistoryContainer) return;

  try {
    const orders = await getOrders(); // API call from api.js
    if (orders.length === 0) {
      orderHistoryContainer.innerHTML = "<p>You have no past orders.</p>";
      return;
    }

    const ordersHTML = orders.map(createOrderHistoryItem).join("");
    orderHistoryContainer.innerHTML = ordersHTML;
  } catch (error) {
    console.error("Failed to load order history:", error);
    orderHistoryContainer.innerHTML =
      "<p>Error loading order history. Please try again.</p>";
  }
}
