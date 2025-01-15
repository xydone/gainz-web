document.getElementById("searchButton").addEventListener("click", async () => {
  const query = document.getElementById("searchInput").value;
  if (!query) return alert("Please enter a search query.");

  try {
    const response = await fetch(
      `http://localhost:3000/api/food?search=${encodeURIComponent(query)}`,

      {}
    );
    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    displayResults(data);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to fetch data. Please try again.");
  }
});

function displayResults(data) {
  const tableBody = document
    .getElementById("resultsTable")
    .querySelector("tbody");
  tableBody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
          <td>${item.food_name}</td>
          <td>${item.brand_name}</td>
          <td>${item.macronutrients.calories.toFixed(2)}</td>
          <td>${item.macronutrients.carbs.toFixed(2)}</td>
          <td>${item.macronutrients.fat.toFixed(2)}</td>
          <td>${item.macronutrients.protein.toFixed(2)}</td>
          <td>${item.macronutrients.sugar.toFixed(2)}</td>
          <td><span class="expand">Show Details</span></td>
          <td>
              <button class="action-button" data-id="${item.id}">Post</button>
              <select class="serving-input hidden"></select>
              <input type="number" class="custom-value hidden" placeholder="Custom Value" min="1" step="1">
          </td>
      `;

    const detailsRow = document.createElement("tr");
    detailsRow.classList.add("hidden");
    detailsRow.innerHTML = `
          <td colspan="8">
              <pre>${JSON.stringify(item.macronutrients, null, 2)}</pre>
          </td>
      `;

    row.querySelector(".expand").addEventListener("click", () => {
      detailsRow.classList.toggle("hidden");
    });

    const postButton = row.querySelector(".action-button");
    const servingInput = row.querySelector(".serving-input");
    const customValueInput = row.querySelector(".custom-value");

    postButton.addEventListener("click", async () => {
      const foodId = postButton.dataset.id;

      if (!servingInput.classList.contains("hidden")) {
        servingInput.classList.toggle("hidden");
        customValueInput.classList.toggle("hidden");
        return;
      }

      try {
        const servingsResponse = await fetch(
          `http://localhost:3000/api/food/${foodId}/servings`
        );
        if (!servingsResponse.ok)
          throw new Error("Failed to fetch servings data.");

        const servingsData = await servingsResponse.json();

        servingInput.innerHTML = "";
        servingsData.forEach((serving) => {
          const option = document.createElement("option");
          option.value = serving.id;
          option.textContent = `${serving.amount} ${serving.unit}`;
          servingInput.appendChild(option);
        });

        servingInput.classList.remove("hidden");
        customValueInput.classList.remove("hidden");

        let confirmButton =
          postButton.parentElement.querySelector(".confirm-button");
        if (!confirmButton) {
          confirmButton = document.createElement("button");
          confirmButton.textContent = "Confirm";
          confirmButton.classList.add("action-button", "confirm-button");
          postButton.parentElement.appendChild(confirmButton);

          confirmButton.addEventListener("click", async () => {
            const selectedServing = servingInput.value;
            const customValue = customValueInput.value || 1;
            try {
              const postResponse = await fetch(
                "http://localhost:3000/api/user/entry",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-access-token": 1,
                  },
                  body: JSON.stringify({
                    food_id: foodId,
                    meal_category:
                      document.getElementById("mealCategory").value,
                    serving_id: selectedServing,
                    amount: parseFloat(customValue),
                  }),
                }
              );

              if (!postResponse.ok) {
                alert(`Post request failed! Status ${postResponse.status}`);

                throw new Error("Post request failed");
              }
              alert("Success!");

              servingInput.classList.add("hidden");
              customValueInput.classList.add("hidden");
              confirmButton.remove();
            } catch (error) {
              console.error("Error:", error);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching servings:", error);
        alert("Failed to load serving sizes. Please try again.");
      }
    });
    tableBody.appendChild(row);
    tableBody.appendChild(detailsRow);
  });
}
