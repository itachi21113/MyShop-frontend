document.addEventListener("DOMContentLoaded", () => {
  // Check for login status
  if (!localStorage.getItem("authToken")) {
    window.location.href = "login.html"; // Redirect to login if not authenticated
    return;
  }

  // --- THIS IS THE FIX ---
  // Call the functions to load profile and order data
  displayUserProfile();
  displayOrderHistory();

  // Add event listener for the logout button
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      window.location.href = "login.html";
    });
  }
});

/**
 * Fetches the current user's data and displays it on the page.
 */
async function displayUserProfile() {
  const profileInfoContainer = document.getElementById("profile-info");
  if (!profileInfoContainer) return;

  try {
    const user = await getCurrentUser(); // API call from api.js
    profileInfoContainer.innerHTML = `
      <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Username:</strong> ${user.username}</p>
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

    // Use the createOrderHistoryItem function from components.js
    const ordersHTML = orders.map(createOrderHistoryItem).join("");
    orderHistoryContainer.innerHTML = ordersHTML;
  } catch (error) {
    console.error("Failed to load order history:", error);
    orderHistoryContainer.innerHTML =
      "<p>Error loading order history. Please try again.</p>";
  }
}
