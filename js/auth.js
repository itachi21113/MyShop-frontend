document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutLink = document.getElementById("logout-link");

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;

      try {
        const data = await loginUser({ email, password });
        localStorage.setItem("authToken", data.accessToken);
        window.location.href = "index.html"; // Redirect to homepage
      } catch (error) {
        alert(`Login failed: ${error.message}`);
      }
    });
  }

  // Handle Registration

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // Read from the new firstName and lastName fields
      const firstName = e.target.firstName.value;
      const lastName = e.target.lastName.value;
      const email = e.target.email.value;
      const password = e.target.password.value;

      try {
        // Send the data in the format the backend expects
        await registerUser({ firstName, lastName, email, password });
        alert("Registration successful! Please log in.");
        window.location.href = "login.html";
      } catch (error) {
        alert(`Registration failed: ${error.message}`);
      }
    });
  }

  // Handle Logout
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("authToken");
      updateNavUI();
      window.location.href = "login.html";
    });
  }

  // Update UI on page load
  updateNavUI();
});

// Replace your old updateNavUI function with this new one in auth.js

function updateNavUI() {
  const token = localStorage.getItem("authToken");
  const loginLink = document.getElementById("login-link");
  const profileLink = document.getElementById("profile-link");
  const logoutLink = document.getElementById("logout-link");
  const adminLink = document.getElementById("admin-link"); // Get the new admin link

  if (token) {
    loginLink.classList.add("hidden");
    profileLink.classList.remove("hidden");
    logoutLink.classList.remove("hidden");

    // --- THIS IS THE NEW LOGIC ---
    const userData = decodeJwt(token);
    // Check if the decoded token has a 'roles' array that includes 'ROLE_ADMIN'
    if (userData && userData.roles && userData.roles.includes("ROLE_ADMIN")) {
      adminLink.classList.remove("hidden"); // Show the admin link
    } else {
      adminLink.classList.add("hidden"); // Hide it for non-admins
    }
    // -----------------------------
  } else {
    loginLink.classList.remove("hidden");
    profileLink.classList.add("hidden");
    logoutLink.classList.add("hidden");
    adminLink.classList.add("hidden"); // Ensure admin link is hidden when not logged in
  }
}

// Add this function to the bottom of auth.js
function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
}
