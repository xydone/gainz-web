document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem("accessToken");
  const displayName = localStorage.getItem("displayName"); // Store username during login
  const isAccessTokenExpired = isTokenExpired(accessToken);
  if (isAccessTokenExpired) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("displayName");
  }
  if (accessToken && displayName && !isAccessTokenExpired) {
    showLoggedInMessage(displayName);
  }
});

function showLoggedInMessage(username) {
  // Check if the container already exists
  let container = document.querySelector(".logged-in-container");
  if (!container) {
    // Create the container
    container = document.createElement("div");
    container.className = "logged-in-container";

    // Create the message element
    const messageElement = document.createElement("div");
    messageElement.className = "logged-in-message";
    container.appendChild(messageElement);

    // Create the logout button
    const logoutButton = document.createElement("button");
    logoutButton.className = "logout-button";
    logoutButton.textContent = "Log Out";
    logoutButton.addEventListener("click", logoutUser);
    container.appendChild(logoutButton);

    document.body.appendChild(container);
  }

  // Update the message content
  const messageElement = container.querySelector(".logged-in-message");
  messageElement.textContent = `You are logged in as ${username}`;
}

function isTokenExpired(token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

function logoutUser() {
  // Clear tokens and username
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("displayName");

  // Remove logged-in message and logout button
  const container = document.querySelector(".logged-in-container");
  if (container) {
    container.remove();
  }

  // Redirect to the login page
  window.location.href = "/index.html";
}
