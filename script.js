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

async function findCity(city) {
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

function showHours(data){
    const h = data.hourly;
    const hour = data.current.time.slice(0, 13);
    const start = h.time.findIndex(t => t.startsWith(hour));
    hours.innerHTML = "";
    for (let i = start; i < start + 6; i++) {
        const label = i === start ? "Now" : h.time[i].slice(11);
        const type = look(h.weather_code[i])[1];
        hours.append(item("hour", [
            "<span>" + label + "</span>",
            iconOf(type),
            "<b>" + round(h.temperature_2m[i]) + "</b>"
        ]));
    }
}


function showDays(data){
    const d = data.daily;
    days.innerHTML = "";
    d.time.forEach((date, i) => {
        const day = new Date(date + "T12:00").getDay();
        const name = i === 0 ? "Today" : DAY[day];
        const type = look(d.weather_code[i])[1];
        days.append(item("day", [
            "<span>" + name + "</span>",
            iconOf(type),
            "<b>" + round(d.temperature_2m_max[i]) + "</b>",
            "<span>" + round(d.temperature_2m_min[i]) + "</span>"
        ]));
    });
}


async function load(name){
    error.textContent = "";
    try {
        const city = await findCity(name);
        const data = await getWeather(city);
        current = city.name;
        showNow(city, data);
        showHours(data);
        showDays(data);
        const time = new Date().toTimeString().slice(0, 5);
        updated.textContent = "Updated at " + time + " (refreshes every 10 minutes)";
        localStorage.setItem("city", city.name);
    }  catch (err) {
        error.textContent = err.message;
    }
}

form.addEventListener("submit", e => {
    e.preventDefault();
    const name = input.value.trim();
    if (name) load(name);
    input.value = "";
});

function refresh() {
    if (current) load(current);
}

setInterval(refresh, REFRESH);

load(localStorage.getItem("city") || "New York");