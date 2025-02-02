async function fetchData() {
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:3000/api/user/entry?start=${startDate}&end=${endDate}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("accessToken"),
        },
      }
    ); // Replace with actual API URL
    const data = await response.json();
    displayData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayData(data) {
  const tableBody = document.getElementById("table-body");
  let html = "";

  const groupedData = {};
  data.forEach((item) => {
    const date = new Date(item.created_at / 1000).toISOString().split("T")[0];
    if (!groupedData[date]) groupedData[date] = {};
    if (!groupedData[date][item.category])
      groupedData[date][item.category] = [];
    groupedData[date][item.category].push(item);
  });

  for (const date in groupedData) {
    html += `<tr class="date-row"><td colspan="7">Date: ${date}</td></tr>`;
    for (const category in groupedData[date]) {
      html += `<tr class="category-row"><td colspan="7">Category: ${category}</td></tr>`;
      groupedData[date][category].forEach((item) => {
        html += `
        <tr>
          <td>${item.food_name}</td>
          <td>${item.brand_name ? item.brand_name : ""}</td>
          <td>${item.macronutrients.calories.toFixed(2)}</td>
          <td>${item.macronutrients.carbs.toFixed(2)}</td>
          <td>${item.macronutrients.protein.toFixed(2)}</td>
          <td>${item.macronutrients.fat.toFixed(2)}</td>
          <td><span class="expand">Show Details</span></td>
          <tr class="details" style="display: none;">
            <td colspan="7">
              <pre>${JSON.stringify(item, null, 2)}</pre>
            </td>
          </tr>
        </tr>`;
      });
    }
  }

  tableBody.innerHTML = html;

  // Attach event listeners to toggle the details row.
  const expandButtons = document.querySelectorAll(".expand");
  expandButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Get the parent row (the food-row) and then the next row, which is the details row.
      const detailsRow = this.closest("tr").nextElementSibling;
      if (detailsRow.style.display === "none") {
        detailsRow.style.display = "table-row";
        this.textContent = "Hide Details";
      } else {
        detailsRow.style.display = "none";
        this.textContent = "Show Details";
      }
    });
  });
}
