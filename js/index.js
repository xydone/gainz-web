const links = [
  {
    name: "Get entries based on range of time",
    url: "getEntries.html",
  },
  { name: "Search and add food", url: "getFood.html" },
  { name: "Create new food", url: "createFood.html" },
];

const linksContainer = document.getElementById("links-container");

links.forEach((link) => {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = link.name;

  const linkCell = document.createElement("td");
  const a = document.createElement("a");
  a.href = link.url;
  a.textContent = "Visit";
  linkCell.appendChild(a);

  row.appendChild(nameCell);
  row.appendChild(linkCell);

  linksContainer.appendChild(row);
});

document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("auth-form");
  const container = document.querySelector(".container");

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from reloading the page

    // Collect username and password from the form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      // Send HTTP POST request to the server
      const response = await fetch("http://localhost:3000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials or server error");
      }

      // Parse the response
      const data = await response.json();

      // Extract tokens
      const { access_token, refresh_token } = data;

      // Store tokens in localStorage (or sessionStorage if you prefer)
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      // Display login success message and hide the form
      authForm.style.display = "none";
      const successMessage = document.createElement("p");
      successMessage.textContent = `You are logged in as ${username}`;
      successMessage.style.marginTop = "20px";
      container.appendChild(successMessage);
    } catch (error) {
      // Handle errors (e.g., invalid credentials, server issues)
      alert(error.message);
    }
  });
});
