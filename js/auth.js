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
        updateNavUI(); // Immediately update UI after login
        window.location.href = "index.html";
      } catch (error) {
        alert(`Login failed: ${error.message}`);
      }
    });
  }

  // Handle Registration
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const firstName = e.target.firstName.value;
      const lastName = e.target.lastName.value;
      const email = e.target.email.value;
      const password = e.target.password.value;

      try {
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

// In MyShop-frontend/js/auth.js

function updateNavUI() {
  const token = localStorage.getItem("authToken");
  const loginLink = document.getElementById("login-link");
  const profileLink = document.getElementById("profile-link");
  const logoutLink = document.getElementById("logout-link");
  const adminLink = document.getElementById("admin-link");

  if (token) {
    loginLink.classList.add("hidden");
    profileLink.classList.remove("hidden");
    logoutLink.classList.remove("hidden");

    const userData = decodeJwt(token);

    // --- ADD THESE TWO LINES FOR DEBUGGING ---
    console.log("Decoded Token Data:", userData);
    console.log(
      "Is Admin:",
      userData && userData.roles && userData.roles.includes("ROLE_ADMIN")
    );
    // -----------------------------------------

    if (userData && userData.roles && userData.roles.includes("ROLE_ADMIN")) {
      adminLink.classList.remove("hidden");
    } else {
      adminLink.classList.add("hidden");
    }
  } else {
    loginLink.classList.remove("hidden");
    profileLink.classList.add("hidden");
    logoutLink.classList.add("hidden");
    adminLink.classList.add("hidden");
  }
}

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
