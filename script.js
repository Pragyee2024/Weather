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

const CODES ={
    0: ["Clear sky", "sun"],
    1: ["Mainly clear", "part"],
    2: ["Partly cloudy", "part"],
    3: ["Overcast", "cloud"],
    45: ["Fog", "fog"],
    51: ["Light drizzle", "rain"],
    61: ["Light rain", "rain"],
    63: ["Moderate rain", "rain"],
    65: ["Heavy rain", "rain"],
    71: ["Light snow", "snow"],
    73: ["Moderate snow", "snow"],
    75: ["Heavy snow", "snow"],
    80: ["Rain showers", "rain"],
    81: ["Rain showers", "rain"],
    82: ["Rain showers", "rain"],
    95: ["Thunderstorm", "storm"],
    96: ["Thunderstorm with hail", "storm"],
    99: ["Thunderstorm with hail", "storm"]
}

function look(code) {
    return CODES[code] || ["Cloudy", "cloud"];
}
