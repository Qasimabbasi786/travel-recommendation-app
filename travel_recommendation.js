document.addEventListener("DOMContentLoaded", () => {
  const btnSearch = document.getElementById("btnSearch");
  const btnClear = document.getElementById("btnClear");
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("resultsContainer");

  btnSearch.addEventListener("click", searchDestinations);
  btnClear.addEventListener("click", clearSearch);

  function clearSearch() {
    searchInput.value = "";
    resultsContainer.innerHTML = "";
  }

  function searchDestinations() {
    const query = searchInput.value.trim().toLowerCase();
    resultsContainer.innerHTML = "";

    if (!query) {
      alert("Please enter a destination, keyword, or country!");
      return;
    }

    fetch("travel_recommendation_api.json")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch data");
        return res.json();
      })
      .then((data) => {
        let results = [];

        // Beach recommendations check
        if (query.includes("beach") || query.includes("beaches")) {
          results = data.beaches;
        } 
        // Temple recommendations check
        else if (query.includes("temple") || query.includes("temples")) {
          results = data.temples;
        } 
        // Country check (or search by specific country name like Australia / Japan)
        else if (query.includes("country") || query.includes("countries")) {
          data.countries.forEach(country => {
            results.push(...country.cities);
          });
        } else {
          const matchedCountry = data.countries.find(
            (c) => c.name.toLowerCase() === query
          );
          if (matchedCountry) {
            results = matchedCountry.cities;
          }
        }

        displayResults(results);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
      });
  }

  function displayResults(items) {
    if (items.length === 0) {
      resultsContainer.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>No matching destinations found. Try searching for 'beach', 'temple', or 'Australia'.</p>";
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" />
        <div class="card-content">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
      `;
      resultsContainer.appendChild(card);
    });
  }
});