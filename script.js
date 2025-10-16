const apiKey = "at_umsKMuF4s1qHPBN1JuP376LbZWoYU";
const input = document.getElementById("ip-input");
const btn = document.getElementById("search-btn");
const form = document.getElementById('ip-form');

let map;// leaflet map object
let currentMarker;// current marker on the map

// we initialize the map from Leaflet
function initializeMap(lat = 0, lng = 0) {
  map = L.map("map").setView([lat, lng], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
  currentMarker = L.marker([lat, lng], { title: "Location" }).addTo(map);
}

// this will display info for ip when searched or default user ip
function displayData(data) {
  document.getElementById("ip").textContent = data.ip;
  document.getElementById("location").textContent = `${data.location.city}, ${data.location.country}`;
  document.getElementById("timezone").textContent = `UTC ${data.location.timezone}`;
  document.getElementById("isp").textContent = data.isp;
}

// fetch the ip data and display to user
function getIPData(ip) {
  fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ip}`)
    .then(res => res.json())
    .then(data => {
      displayData(data);
      updateMap(data.location.lat, data.location.lng);
    })
    .catch(err => console.error("Error fetching IP data:", err));
}

// update map marker location according to current ip location
function updateMap(lat, lng) {
  map.setView([lat, lng], 13);
  if (currentMarker) map.removeLayer(currentMarker);
  currentMarker = L.marker([lat, lng], { title: "Location" }).addTo(map);
}

// handle search button click event
btn.addEventListener("click", () => getIPData(input.value));

// also handle when the user is pressing enter key to search
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    btn.click();
  }
});

// clear the input field and user ip data when input is empty
input.addEventListener("input", function() {
  if (input.value === "") {
    fetch("https://api.ipify.org?format=json")
      .then(res => res.json())
      .then(data => getIPData(data.ip));
  }
});

// once the page loads for the first time, get user's ip address and display data
window.onload = function() {
  initializeMap();
  fetch("https://api.ipify.org?format=json")
    .then(res => res.json())
    .then(data => getIPData(data.ip));
};

//handle form submission to prevent page reload 
form.addEventListener('submit', function(event) {
  event.preventDefault();
  getIPData(input.value);
});
//clear the input field and user ip data when input is empty
input.addEventListener('input', function() {
  if (input.value === '') {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => getIPData(data.ip));
  }
});

