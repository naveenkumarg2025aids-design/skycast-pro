🌤️ SkyCast Pro
SkyCast Pro is a dynamic weather application designed to provide accurate, real-time meteorological data and time synchronization for cities across the globe.

🚀 Key Features
Global City Search: Users can search for any city to instantly retrieve current weather conditions including temperature, humidity, and weather descriptions.

True Local Time Logic: Unlike standard weather apps that display the user's time, SkyCast Pro utilizes the Luxon library to calculate the precise local time of the target city, adjusting for all global timezones and daylight savings automatically.

5-Day Forecast: A detailed view showing weather trends for the upcoming week using a grid layout.

Robust Error Handling: Includes intelligent fallbacks for weather icons (downgrading quality if high-res fails) and user-friendly error messages for invalid city names.

Modern UI/UX: Features a "Glassmorphism" card design, responsive layout for mobile/desktop, and a soothing animated gradient background.

🛠️ Tech Stack
Frontend: HTML5, CSS3 (CSS Grid, Flexbox, Keyframe Animations)

Logic: Vanilla JavaScript (ES6+, Async/Await)

Time Management: Luxon.js (for timezone offset handling)

Data Source: OpenWeatherMap API
