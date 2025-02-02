function formatGroupDate(timestamp) {
  console.log(timestamp);
  const date = new Date(timestamp / 1000);
  return date.toLocaleDateString();
}

function generateTableRows(data) {
  const tableBody = document
    .getElementById("resultsTable")
    .querySelector("tbody");
  tableBody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");
    console.log(item);
    row.innerHTML = `
          <td>${formatGroupDate(item.group_date)}</td>
          <td>${item.macronutrients.calories.toFixed(2)}</td>
          <td>${item.macronutrients.carbs.toFixed(2)}</td>
          <td>${item.macronutrients.fat.toFixed(2)}</td>
          <td>${item.macronutrients.protein.toFixed(2)}</td>
          <td>${item.macronutrients.sugar.toFixed(2)}</td>
          <td><span class="expand">Show Details</span></td>
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

    tableBody.appendChild(row);
    tableBody.appendChild(detailsRow);
  });
}

document.getElementById("fetch-data").addEventListener("click", async () => {
  const category = document.getElementById("category-select").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;

  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  await fetch(
    `http://localhost:3000/api/user/entry/stats?group=${category}&start=${startDate}&end=${endDate}`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("accessToken"),
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        generateTableRows(data);
      } else {
        alert("No data found for the given date range.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert(`There was an error fetching the data. Error is: ${error}`);
    });
});
