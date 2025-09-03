const API_BASE_URL = "/api";

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("authToken");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "An unknown error occurred." }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  if (response.headers.get("content-type")?.includes("application/json")) {
    return response.json();
  }
  return;
}

const loginUser = (credentials) =>
  fetchWithAuth("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
const registerUser = (userData) =>
  fetchWithAuth("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
const getCurrentUser = () => fetchWithAuth("/users/me");
const getAllProducts = () => fetchWithAuth("/products");
const getProductById = (productId) => fetchWithAuth(`/products/${productId}`);
const getCart = () => fetchWithAuth("/cart");
const addToCart = (productId, quantity) =>
  fetchWithAuth("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
const removeFromCart = (cartItemId) =>
  fetchWithAuth(`/cart/items/${cartItemId}`, { method: "DELETE" });
const getOrders = () => fetchWithAuth("/orders/my-orders"); // CORRECTED
const createOrder = () =>
  fetchWithAuth("/orders", { method: "POST", body: JSON.stringify({}) });
const createPaymentIntent = (orderId) =>
  fetchWithAuth("/payments/create-intent", {
    method: "POST",
    body: JSON.stringify({ orderId: orderId }),
  });
const createProduct = (productData) =>
  fetchWithAuth("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
