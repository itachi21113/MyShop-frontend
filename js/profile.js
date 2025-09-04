// MyShop-frontend/js/profile.js

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("authToken")) {
    window.location.href = "login.html";
    return;
  }

  checkForPaymentSuccess();
  displayUserProfile();
  displayOrderHistory();
});

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
    window.history.replaceState({}, document.title, "/profile.html");
  }
}

async function displayUserProfile() {
  const profileInfoContainer = document.getElementById("profile-info");
  if (!profileInfoContainer) return;

  try {
    const user = await getCurrentUser();
    profileInfoContainer.innerHTML = `<p><strong>Email:</strong> ${user.email}</p>`;
  } catch (error) {
    console.error("Failed to load user profile:", error);
    profileInfoContainer.innerHTML =
      "<p>Error loading profile. Please try again.</p>";
  }
}

async function displayOrderHistory() {
  const orderHistoryContainer = document.getElementById("order-history");
  if (!orderHistoryContainer) return;

  try {
    const orders = await getOrders();
    if (orders.length === 0) {
      orderHistoryContainer.innerHTML = "<p>You have no past orders.</p>";
      return;
    }

    // This will now work because profile.html loads components.js first
    const ordersHTML = orders.map(createOrderHistoryItem).join("");
    orderHistoryContainer.innerHTML = ordersHTML;
  } catch (error) {
    console.error("Failed to load order history:", error);
    orderHistoryContainer.innerHTML =
      "<p>Error loading order history. Please try again.</p>";
  }
}
