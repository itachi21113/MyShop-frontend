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

function updateNavUI() {
  const token = localStorage.getItem("authToken");
  const loginLink = document.getElementById("login-link");
  const profileLink = document.getElementById("profile-link");
  const logoutLink = document.getElementById("logout-link");

  if (token) {
    loginLink.classList.add("hidden");
    profileLink.classList.remove("hidden");
    logoutLink.classList.remove("hidden");
  } else {
    loginLink.classList.remove("hidden");
    profileLink.classList.add("hidden");
    logoutLink.classList.add("hidden");
  }
}
