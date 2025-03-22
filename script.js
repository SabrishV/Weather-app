const apiKey = "e1e02038717686ce0b6feed6b44e93be";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherDiv = document.querySelector(".weather");
const errorDiv = document.querySelector(".error");
const weatherIcon = document.querySelector(".weather-icon i");
const citiesContainer = document.getElementById("cities-container");
const topCitiesContainer = document.querySelector(".top-cities");

const topCities = ["London", "Paris", "Tokyo", "Sydney"];

weatherDiv.style.display = "none";
errorDiv.style.display = "none";

async function checkWeather(city, isTopCity = false) {
    if (!city.trim()) return;

    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if (!response.ok) {
            if (!isTopCity) {
                errorDiv.style.display = "block";
                weatherDiv.style.display = "none";
            }
            return;
        }

        const data = await response.json();

        if (isTopCity) {
            displayTopCityWeather(data);
        } else {
            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + " °C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + " %";
            document.querySelector(".wind-speed").innerHTML = data.wind.speed + " km/h";

            weatherDiv.style.display = "block";
            errorDiv.style.display = "none";
            topCitiesContainer.style.display = "none";

            setTimeout(() => {
                weatherIcon.className = getWeatherIcon(data.weather[0].main);
                weatherDiv.classList.add("show");
            }, 500);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function getWeatherIcon(condition) {
    const icons = {
        "Clouds": "fa-solid fa-cloud",
        "Clear": "fa-solid fa-sun",
        "Rain": "fa-solid fa-cloud-showers-heavy",
        "Drizzle": "fa-solid fa-cloud-rain",
        "Mist": "fa-solid fa-smog"
    };
    return icons[condition] || "fa-solid fa-question";
}

function displayTopCityWeather(data) {
    const cityElement = document.createElement("div");
    cityElement.classList.add("city-box");
    cityElement.innerHTML = `
        <h3>${data.name}</h3>
        <p>${Math.round(data.main.temp)} °C</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>Wind: ${data.wind.speed} km/h</p>
        <i class="${getWeatherIcon(data.weather[0].main)}"></i>
    `;
    citiesContainer.appendChild(cityElement);
}

searchBtn.addEventListener("click", () => checkWeather(searchBox.value));
searchBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkWeather(searchBox.value);
});

window.onload = () => {
    citiesContainer.innerHTML = "";
    topCities.forEach(city => checkWeather(city, true));
};
