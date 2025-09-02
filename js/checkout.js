document.addEventListener("DOMContentLoaded", () => {
  if (document.body.id === "checkout-page") {
    initializeCheckout();
  }
});

/**
 * Initializes the Stripe payment form following the backend's logic:
 * 1. Creates an Order from the user's cart.
 * 2. Uses the new Order ID to create a Payment Intent.
 * 3. Renders the Stripe payment form.
 */
async function initializeCheckout() {
  const stripe = Stripe(config.stripePublishableKey);
  const checkoutForm = document.getElementById("checkout-form");
  const paymentElementContainer = document.getElementById("payment-element");
  const submitButton = document.getElementById("submit-payment");
  const messageContainer = document.getElementById("payment-message");

  let elements;

  try {
    // Step 1: Create an order from the user's cart.
    // The backend will handle calculating the total amount.
    console.log("Creating order...");
    const newOrder = await createOrder();
    const orderId = newOrder.id;
    console.log(`Order created with ID: ${orderId}`);

    if (!orderId) {
      throw new Error("Failed to create order, no ID received.");
    }

    // Step 2: Create a Payment Intent using the new order ID.
    console.log("Creating payment intent...");
    const { clientSecret } = await createPaymentIntent(orderId);
    console.log("Payment intent created successfully.");

    // Step 3: Initialize Stripe Elements with the client secret.
    elements = stripe.elements({ clientSecret });
    const paymentElement = elements.create("payment");
    paymentElement.mount(paymentElementContainer);
  } catch (error) {
    console.error("Failed to initialize checkout:", error);
    let errorMessage = "Error loading payment form. Please try again.";
    if (error.message.includes("empty cart")) {
      errorMessage =
        "Your cart is empty. Please add items before checking out.";
      // Optionally, redirect the user back to the cart page
      // window.location.href = "cart.html";
    }
    messageContainer.textContent = errorMessage;
    return;
  }

  // Handle the form submission.
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/profile.html?payment=success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      messageContainer.textContent = error.message;
    } else {
      messageContainer.textContent = "An unexpected error occurred.";
    }

    setLoading(false);
  });

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
  }
}
