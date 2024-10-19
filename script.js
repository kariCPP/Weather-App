// script.js

const geoApiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Add your OpenWeatherMap API key here

// Function to get latitude and longitude for a city using OpenWeatherMap Geocoding API
function getWeatherForCity() {
  const city = document.getElementById('cityInput').value;

  // OpenWeatherMap Geocoding API URL
  const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${geoApiKey}`;

  // Fetch latitude and longitude for the city
  fetch(geocodingUrl)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;
        const cityName = data[0].name;

        // Use the latitude and longitude to fetch weather data
        getWeatherForLocation(lat, lon, cityName);
      } else {
        alert('City not found!');
      }
    })
    .catch(error => console.error('Error fetching geocoding data:', error));
}

// Function to fetch the weather data based on latitude and longitude
function getWeatherForLocation(lat, lon, cityName) {
  // Open-Meteo API URL with dynamic latitude and longitude
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      updateCurrentWeather(data.current_weather, cityName);
      updateForecast(data.hourly);
    })
    .catch(error => console.error('Error fetching weather data:', error));
}

// Update the current weather section
function updateCurrentWeather(current, cityName) {
  document.getElementById('location').textContent = cityName;
  document.getElementById('temperature').textContent = `Temperature: ${current.temperature} °C`;
  document.getElementById('wind-speed').textContent = `Wind Speed: ${current.windspeed} km/h`;
}

// Update the hourly forecast section
function updateForecast(hourly) {
  const forecastList = document.getElementById('forecast-list');
  forecastList.innerHTML = ''; // Clear any previous content

  const hours = hourly.time.slice(0, 7);  // Let's display the first 7 hours for simplicity
  const temperatures = hourly.temperature_2m;
  const windSpeeds = hourly.wind_speed_10m;
  const humidities = hourly.relative_humidity_2m;

  hours.forEach((time, index) => {
    const forecastItem = document.createElement('div');
    forecastItem.classList.add('forecast-item');
    forecastItem.innerHTML = `
      <p>${time.split('T')[1]}</p>
      <p>Temp: ${temperatures[index]} °C</p>
      <p>Wind: ${windSpeeds[index]} km/h</p>
      <p>Humidity: ${humidities[index]}%</p>
    `;
    forecastList.appendChild(forecastItem);
  });
}
