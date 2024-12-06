// Your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWxlamFuZHJvcXVpbnRvIiwiYSI6ImNseDZxbGFpcjE1ZHMyanNjZWg1eDIzejkifQ.VYiLvOBYgX5WwchhqO0I8w'; // Replace with your token

// Initialize Mapbox map
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v11', // style URL
  center: [-0.118092, 51.509865], // starting position [lng, lat]
  zoom: 6, // starting zoom
  pitch: 45, // tilt the map
  bearing: -17.6, // rotate the map
  antialias: true, // smoother edges for 3D rendering
});

// Add navigation controls
map.addControl(new mapboxgl.NavigationControl());

let marker;

// Search functionality using Mapbox Geocoding API
document.getElementById('search-btn').addEventListener('click', () => {
  const address = document.getElementById('address-input').value;
  if (!address) {
    alert('Please enter an address or postcode!');
    return;
  }
  fetchLocationData(address);
});

function fetchLocationData(query) {
  const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?access_token=${mapboxgl.accessToken}`;

  fetch(geocodeUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.features.length > 0) {
        const location = data.features[0];
        const [lng, lat] = location.center;
        const displayAddress = location.place_name;

        // Add marker
        if (marker) marker.remove();
        marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

        // Set map center and zoom
        map.flyTo({
          center: [lng, lat],
          zoom: 14,
        });

        // Display address next to "Location Map"
        const locationMapTitle = document.querySelector('.map-container h2');
        locationMapTitle.innerHTML = `Location Map: <span>${displayAddress}</span>`;

        // Add radius circle and update values
        addRadius(lat, lng);
        updateValues();
      } else {
        alert('Location not found. Please try a different address or postcode.');
      }
    })
    .catch((error) => {
      console.error('Error fetching location:', error);
      alert('An error occurred while searching for the location.');
    });
}

// Add radius circle to the map
function addRadius(lat, lng) {
  if (map.getSource('radius-circle')) {
    map.removeLayer('radius-circle');
    map.removeSource('radius-circle');
  }

  const circleGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [createCircleCoordinates([lng, lat], 25000)],
        },
      },
    ],
  };

  map.addSource('radius-circle', {
    type: 'geojson',
    data: circleGeoJSON,
  });

  map.addLayer({
    id: 'radius-circle',
    type: 'fill',
    source: 'radius-circle',
    paint: {
      'fill-color': '#187E6C',
      'fill-opacity': 0.2,
    },
  });
}

// Function to create circle coordinates
function createCircleCoordinates(center, radiusInMeters) {
  const coordinates = [];
  const steps = 64; // Increase for smoother circle
  const earthRadius = 6378137;

  for (let i = 0; i < steps; i++) {
    const angle = (i * 360) / steps;
    const radian = (Math.PI / 180) * angle;
    const lat = center[1] + (radiusInMeters / earthRadius) * Math.cos(radian);
    const lng =
      center[0] +
      ((radiusInMeters / earthRadius) * Math.sin(radian)) /
        Math.cos((Math.PI / 180) * center[1]);
    coordinates.push([lng, lat]);
  }
  coordinates.push(coordinates[0]); // Close the polygon
  return coordinates;
}

// Handle map click functionality
map.on('click', (event) => {
  const { lng, lat } = event.lngLat;

  if (marker) marker.remove();
  marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

  map.flyTo({
    center: [lng, lat],
    zoom: 14,
  });

  // Reverse geocode to get address
  fetchReverseGeocode(lng, lat);

  addRadius(lat, lng);
  updateValues();
});

function fetchReverseGeocode(lng, lat) {
  const reverseGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`;
  fetch(reverseGeocodeUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.features.length > 0) {
        const displayAddress = data.features[0].place_name;

        // Display address next to "Location Map"
        const locationMapTitle = document.querySelector('.map-container h2');
        locationMapTitle.innerHTML = `Location Map: <span>${displayAddress}</span>`;
      }
    })
    .catch((error) => console.error('Error fetching reverse geocode:', error));
}

// Function to update indicators, challenges, and strengths
function updateValues() {
  // Same logic for updating community values, area challenges, and strengths
  const themes = [
    {
      title: "Community Needs",
      indicators: ["Stakeholder Level", "Deprivation Level", "Population Growth", "Crime Level", "Walkability Level"],
    },
    {
      title: "Youth Needs",
      indicators: ["Youth Population Density", "Skills and Apprenticeship Level", "Economic Activity", "Stakeholder Density", "Evening Economy"],
    },
    {
      title: "Elderly Needs",
      indicators: ["Elderly Poverty Level", "Later Living Wellness", "Elderly Potential Loneliness", "Digital Inclusion", "Walkability"],
    },
    {
      title: "Diverse Needs",
      indicators: ["Community Asset Alignment", "D&I Asset Ratio", "Faith Assets", "Special Education Needs"],
    },
    {
      title: "Economic Needs",
      indicators: ["IMD Score", "High Qualification Levels", "Businesses over 5m turnover", "Planning Applications Ratio", "Home Ownership Levels"],
    },
    {
      title: "Sustainability Needs",
      indicators: ["Green Spaces Proximity", "Green Spaces Ratio", "EPC Ratings", "Transport Connectivity", "Energy Deprivation"],
    },
  ];

  // Update logic for Community Value Score, Area Challenges, and Strengths remains unchanged.
}

// Initial values
updateValues();



// Function to update indicators, challenges, and strengths
function updateValues() {
  const themes = [
    {
      title: "Community Needs",
      indicators: ["Stakeholder Level", "Deprivation Level", "Population Growth", "Crime Level", "Walkability Level"],
    },
    {
      title: "Youth Needs",
      indicators: ["Youth Population Density", "Skills and Apprenticeship Level", "Economic Activity", "Stakeholder Density", "Evening Economy"],
    },
    {
      title: "Elderly Needs",
      indicators: ["Elderly Poverty Level", "Later Living Wellness", "Elderly Potential Loneliness", "Digital Inclusion", "Walkability"],
    },
    {
      title: "Diverse Needs",
      indicators: ["Community Asset Alignment", "D&I Asset Ratio", "Faith Assets", "Special Education Needs"],
    },
    {
      title: "Economic Needs",
      indicators: ["IMD Score", "High Qualification Levels", "Businesses over 5m turnover", "Planning Applications Ratio", "Home Ownership Levels"],
    },
    {
      title: "Sustainability Needs",
      indicators: ["Green Spaces Proximity", "Green Spaces Ratio", "EPC Ratings", "Transport Connectivity", "Energy Deprivation"],
    },
  ];

  const coreThemesContainer = document.getElementById("core-themes");
  coreThemesContainer.innerHTML = ""; // Clear existing content

  let totalValue = 0; // Sum of all indicator values
  let totalIndicators = 0; // Total number of indicators
  const challenges = []; // Track the lowest-rated indicators
  const strengths = []; // Track the highest-rated indicators

  themes.forEach((theme) => {
    const themeBox = document.createElement("div");
    themeBox.classList.add("theme-box");
    themeBox.innerHTML = `<h3>${theme.title}</h3>`;

    theme.indicators.forEach((indicator) => {
      const value = (Math.random() * 10).toFixed(1); // Generate random value
      totalValue += parseFloat(value);
      totalIndicators++;

      const colorClass = value >= 7 ? "green" : value >= 4 ? "yellow" : "red";

      // Add to challenges if the value is below 4
      if (value < 4) {
        challenges.push({ indicator, value });
      }

      // Add to strengths if the value is 7 or higher
      if (value >= 7) {
        strengths.push({ indicator, value });
      }

      const indicatorDiv = document.createElement("div");
      indicatorDiv.classList.add("indicator");
      indicatorDiv.innerHTML = `
        <span>${indicator}</span>
        <div class="bar-wrapper">
          <div class="bar">
            <div class="average-marker"></div>
            <div class="fill ${colorClass}" style="width: ${value * 10}%;"></div>
          </div>
          <span class="value">${value}</span>
        </div>
      `;
      themeBox.appendChild(indicatorDiv);
    });

    coreThemesContainer.appendChild(themeBox);
  });

  // Update Community Value Score
  const communityScore = (totalValue / totalIndicators).toFixed(1);
  const communityScoreElement = document.getElementById("community-score");
  communityScoreElement.textContent = communityScore;
  communityScoreElement.style.color =
    communityScore >= 7 ? "#187E6C" : communityScore >= 4 ? "#DF9F29" : "#AB2D1E";

  // Update Area Challenges
  const challengesList = document.getElementById("challenges-list");
  challengesList.innerHTML = ""; // Clear existing challenges

  challenges
    .sort((a, b) => a.value - b.value) // Sort by lowest value
    .slice(0, 5) // Limit to top 5 challenges
    .forEach((challenge) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${challenge.indicator}: ${challenge.value}`;
      challengesList.appendChild(listItem);
    });

  // Update Area Strengths
  const strengthsList = document.getElementById("strengths-list");
  strengthsList.innerHTML = ""; // Clear existing strengths

  strengths
    .sort((a, b) => b.value - a.value) // Sort by highest value
    .slice(0, 5) // Limit to top 5 strengths
    .forEach((strength) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${strength.indicator}: ${strength.value}`;
      strengthsList.appendChild(listItem);
    });

// Generate Summary
const summaryText = generateSummary(strengths.slice(0, 3), challenges.slice(0, 3));
document.getElementById("summary-text").textContent = summaryText;
}
// Initial values
updateValues();

function generateSummary(strengths, challenges) {
  let summary = "The area demonstrates significant strengths in ";
  summary += strengths.map(s => `${s.indicator} (${s.value})`).join(", ");
  summary += ". ";

  summary += "However, notable challenges include ";
  summary += challenges.map(c => `${c.indicator} (${c.value})`).join(", ");
  summary += ".";

  return summary;
}

