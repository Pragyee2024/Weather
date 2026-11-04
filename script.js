const form = document.querySelector("#search");
const input = document.querySelector("#city");
const error = document.querySelector("#error");
const place = document.querySelector("#place");
const temp = document.querySelector("#temp");
const desc = document.querySelector("#desc");
const icon = document.querySelector("#icon");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const updated = document.querySelector("#updated");
const hours = document.querySelector("#hours");
const days = document.querySelector("#days");

const GEO = "https://geocoding-api.open-meteo.com/v1/search";
const API = "https://api.open-meteo.com/v1/forecast";
const REFRESH = 10 * 60 * 1000; // 10 minutes
const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let current = null;

const CODES = {
    0: ["Clear sky", "sun"],
    1: ["Mainly clear", "part"],
    2: ["Partly cloudy", "part"],
    3: ["Overcast", "cloud"],
    45: ["Fog", "cloud"],
    48: ["Fog", "cloud"],
    51: ["Light drizzle", "rain"],
    53: ["Drizzle", "rain"],
    55: ["Heavy drizzle", "rain"],
    61: ["Light rain", "rain"],
    63: ["Moderate rain", "rain"],
    65: ["Heavy rain", "rain"],
    71: ["Light snow", "cloud"],
    73: ["Moderate snow", "cloud"],
    75: ["Heavy snow", "cloud"],
    80: ["Rain showers", "rain"],
    81: ["Rain showers", "rain"],
    82: ["Rain showers", "rain"],
    95: ["Thunderstorm", "rain"],
    96: ["Thunderstorm with hail", "rain"],
    99: ["Thunderstorm with hail", "rain"]
};

function look(code) {
    return CODES[code] || ["Cloudy", "cloud"];
}

sync function findCity(city) {
    const url = GEO + "?name=" + encodeURIComponent(city);
    const response = await fetch(url);
    const data = await response.json();
    if(!data.results || data.results.length === 0) {
        throw new Error("City not found");
    }
    return data.results[0];
}

async function getWeather(city) {
    const params = new URLSearchParams({
        latitude: city.latitude,
        longitude: city.longitude,
        current: [
            "temperature_2m", "relative_humidity_2m", "apparent_temperature", "weather_code", "wind_speed_10m"
        ].join(","),
        hourly: "temperature_2m,weather_code",
        daily: [
            "weather_code", "temperature_2m_max", "temperature_2m_min"
        ].join(","),
        forecast_days: 7,
        timezone: "auto"
    });

    const response = await fetch(API + "?" + params);
    return response.json();

}

const round = n => Math.round(n) + "°C";
const iconOf = t => '<span class="icon ' + t + '"></span>';

function item(cls,parts){
    const div = document.createElement("div");
    div.className = cls;
    div.innerHTML = parts.join("");
    return div;
}

function showNow(city, data){
    const now = data.current;
    const [text, type] = look(now.weather_code);
    place.textContent = city.name + ", " + city.country_code;
    temp.textContent = round(now.temperature_2m);
    desc.textContent = text;
    icon.className = "icon big " + type;
    feelsLike.textContent = round(now.apparent_temperature);
    humidity.textContent = now.relative_humidity_2m + "%";
    wind.textContent = Math.round(now.wind_speed_10m) + " km/h";
}
