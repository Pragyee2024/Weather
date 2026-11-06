# 🌤️Weather

A responsive weather app built with HTML, CSS and vanilla JavaScript. Search any city to see current conditions, the next 6 hours and a 7-day forecast.

## ✨ Features

- 🔍 Search any city worldwide
- 🌡️ Current temperature, feels-like, humidity and wind speed
- ⏰ Hourly forecast for the next 6 hours
- 📅 7-day forecast with daily high and low
- ☀️ Weather icons drawn in pure CSS (no images)
- 🔄 Auto-refreshes every 10 minutes
- 💾 Remembers the last searched city
- 📱 Responsive layout for mobile and desktop

## 🛠️ Tech Stack

- 🧱 HTML5
- 🎨 CSS3 (Grid, Flexbox, glassmorphism)
- ⚡ JavaScript (ES6, Fetch API)
- 🌐 [Open-Meteo API](https://open-meteo.com/) (no API key required)


## 📁 Project Structure

```
Weather/
├── index.html
├── style.css
└── script.js
```

## 🚀 Getting Started

```bash
git clone https://github.com/Pragyee2024/Weather.git
cd Weather
```

Open `index.html` in your browser. No build step or API key needed.

## ⚙️ How It Works

1. 📍 The city name is converted to coordinates using the Open-Meteo Geocoding API.
2. 📡 Coordinates are sent to the Open-Meteo Forecast API for current, hourly and daily data.
3. 🌦️ Weather codes are mapped to CSS icons (sun, partly cloudy, cloud, rain).
