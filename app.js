const API_KEY = "f81e6045283b0445c6903889dbe873ad"; 

function getCityFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("city");
}

// ------------------------------------------------------
// ⚡ MANUAL TIME CALCULATION (The only way to be 100% sure)
// ------------------------------------------------------
function getFormattedCityTime(timezoneOffsetInSeconds) {
    // 1. Get current UTC time in milliseconds
    const now = new Date();
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    
    // 2. Add the city's offset to get the "City Time"
    const cityTimeMs = utcMs + (timezoneOffsetInSeconds * 1000);
    const cityDate = new Date(cityTimeMs);

    // 3. Extract components manually to avoid browser timezone interference
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[cityDate.getDay()];
    const monthName = months[cityDate.getMonth()];
    const dateNum = cityDate.getDate();
    
    let hours = cityDate.getHours();
    const minutes = cityDate.getMinutes().toString().padStart(2, '0');
    
    // AM/PM Logic
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // '0' becomes '12'

    return `${dayName}, ${monthName} ${dateNum} | ${hours}:${minutes} ${ampm}`;
}

// ------------------------------------------------------
// LOAD WEATHER
// ------------------------------------------------------
async function loadCurrentWeather() {
  const city = getCityFromUrl();
  const cityNameEl = document.getElementById("cityName");
  const dateTimeEl = document.getElementById("dateTime");
  const currentWeatherEl = document.getElementById("currentWeather");
  const forecastBtn = document.getElementById("forecastBtn");
  
  // 1. Handle "No City" Case
  if (!city) {
      if(cityNameEl) cityNameEl.innerText = "City not selected";
      if(currentWeatherEl) currentWeatherEl.innerHTML = "<p><a href='index.html' style='color:white;'>Click here to go back</a></p>";
      return;
  }

  // 2. Update Title
  if(cityNameEl) cityNameEl.innerText = city.toUpperCase();
  if(currentWeatherEl) currentWeatherEl.innerHTML = "Fetching weather...";

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    // ⚡ FIX 1: Set Time Manually
    if (dateTimeEl) {
        dateTimeEl.innerText = getFormattedCityTime(data.timezone);
    }

    // ⚡ FIX 2: Icon Handling
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    const fallbackUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    currentWeatherEl.innerHTML = `
        <div style="background: rgba(255,255,255,0.1); border-radius: 50%; width: 130px; height: 130px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
            <img src="${iconUrl}" 
                 alt="${data.weather[0].description}" 
                 style="width: 120px; height: 120px;"
                 onerror="this.onerror=null; this.src='${fallbackUrl}';">
        </div>
        
        <div class="large-temp" style="font-size: 4rem; margin: 10px 0;">${Math.round(data.main.temp)}&deg;C</div>
        <p class="condition-text" style="font-size: 1.4rem; text-transform: capitalize;">${data.weather[0].description}</p>
    `;

    if(forecastBtn) {
        forecastBtn.style.display = 'inline-block';
        forecastBtn.onclick = () => {
            window.location.href = `forecast.html?city=${encodeURIComponent(city)}`;
        };
    }

  } catch (error) {
    console.error(error); // See console for details
    if(currentWeatherEl) currentWeatherEl.innerHTML = `<p style="color: #ffcccc;">Error: ${error.message}</p>`;
    if(dateTimeEl) dateTimeEl.innerText = "--";
    if(forecastBtn) forecastBtn.style.display = 'none';
  }
}

// ------------------------------------------------------
// LOAD FORECAST (Keep this so forecast.html works)
// ------------------------------------------------------
async function loadForecast() {
  const city = getCityFromUrl();
  const title = document.getElementById("cityTitle");
  const container = document.getElementById("forecastCard");

  if (!city) {
    if(title) title.innerText = "City not selected";
    return;
  }
  
  if(title) title.innerText = `${city.toUpperCase()} | 5-DAY FORECAST`;
  if(container) container.innerHTML = "Fetching forecast...";

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!res.ok) throw new Error("Forecast error");
    const data = await res.json();
    
    const dailyData = data.list.filter((item) => item.dt_txt.includes("12:00:00"));
    const listToRender = (dailyData.length > 0) ? dailyData : data.list.slice(0, 5);

    renderGrid(listToRender, "forecastCard");
    
  } catch (error) {
    if(container) container.innerHTML = `<p style="color: #ffcccc;">Error: ${error.message}</p>`;
  }
}

function renderGrid(dataList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ""; 

    dataList.slice(0, 5).forEach(day => {
      const dateObj = new Date(day.dt * 1000);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      const dateNum = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const iconCode = day.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
      const div = document.createElement("div");
      div.className = "weather-card forecast-card"; 
      
      div.innerHTML = `
        <h4>${dayName}</h4>
        <p style="font-size:0.85rem; opacity:0.7; margin:-5px 0 5px 0;">${dateNum}</p>
        <img src="${iconUrl}" width="50" height="50">
        <p style="font-size:1.2rem; font-weight:bold;">${Math.round(day.main.temp)}&deg;C</p>
        <p style="font-size: 0.9em; opacity: 0.8;">${day.weather[0].description}</p>
      `;
      container.appendChild(div);
    });
}