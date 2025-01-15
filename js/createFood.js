document
  .getElementById("addFoodForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const nullableValue = (id) => {
      const value = document.getElementById(id).value.trim();
      return value === "" ? null : parseFloat(value);
    };
    const data = {
      food_name: document.getElementById("foodName").value.trim() || null,
      brand_name: document.getElementById("brandName").value.trim() || null,
      macronutrients: {
        calories: document.getElementById("calories").value,
        fat: nullableValue("fat"),
        sat_fat: nullableValue("sat_fat"),
        polyunsat_fat: nullableValue("polyunsat_fat"),
        monounsat_fat: nullableValue("monounsat_fat"),
        trans_fat: nullableValue("trans_fat"),
        cholesterol: nullableValue("cholesterol"),
        sodium: nullableValue("sodium"),
        potassium: nullableValue("potassium"),
        carbs: nullableValue("carbs"),
        fiber: nullableValue("fiber"),
        sugar: nullableValue("sugar"),
        protein: nullableValue("protein"),
        vitamin_a: nullableValue("vitamin_a"),
        vitamin_c: nullableValue("vitamin_c"),
        calcium: nullableValue("calcium"),
        iron: nullableValue("iron"),
        added_sugars: nullableValue("added_sugars"),
        vitamin_d: nullableValue("vitamin_d"),
        sugar_alcohols: nullableValue("sugar_alcohols"),
      },
    };

    try {
      const response = await fetch("http://localhost:3000/api/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": 1,
        },
        body: JSON.stringify(data),
      });

      const messageBox = document.getElementById("message");

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();

        if (response.ok) {
          alert("Food item successfully added!");
          messageBox.textContent = "Food item successfully added!";
          messageBox.classList.remove("hidden");
          messageBox.style.color = "green";
        } else {
          alert(`Error: ${result.message || "Unknown error"}`);
          messageBox.textContent = `Error: ${
            result.message || "Unknown error"
          }`;
          messageBox.classList.remove("hidden");
          messageBox.style.color = "red";
        }
      } else {
        const text = await response.text();
        messageBox.textContent = `Server responded: ${text}`;
        messageBox.classList.remove("hidden");
        messageBox.style.color = response.ok ? "green" : "red";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add food item. Please try again.");
    }
  });
