function weather() {
    const cityName = document.querySelector(".city").value.trim();
    const result1 = document.querySelector(".result");

    if (!cityName) {
        result1.innerHTML = "<span class='error-message'>Please enter a city name.</span>";
        return;
    }

    result1.innerHTML = "<span class='loading-message'>Fetching weather data...</span>"; // Show loading message

    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=42c9534dbe304745166857d57e0c578d&units=metric`)
        .then(function (response) {
            const { temp, humidity, pressure } = response.data.main || {};
            const { description } = (response.data.weather && response.data.weather[0]) || { description: '' };
            // set flag if country available
            if (response.data.sys && response.data.sys.country) {
                const country = response.data.sys.country;
                const flagEl = document.querySelector('.city-flag');
                if (flagEl) {
                    try {
                        const code = country.toUpperCase();
                        const flag = code.replace(/./g, char => String.fromCodePoint(0x1F1E6 - 65 + char.charCodeAt(0))).slice(0,2);
                        flagEl.textContent = flag;
                    } catch (e) { /* ignore */ }
                }
            }

            let icon = ""; // Weather condition indicator
            if (temp >= 30) icon = "🌞";
            else if (temp <= 10) icon = "❄️";
            else if (temp > 10 && temp < 20) icon = "🌤️";
            else icon = "☁️";

            // Build result DOM safely
            result1.innerHTML = '';
            const container = document.createElement('div'); container.className = 'weather-container';
            const iconEl = document.createElement('div'); iconEl.className = 'weather-icon'; iconEl.textContent = icon;
            const tempEl = document.createElement('div'); tempEl.className = 'weather-temp'; tempEl.textContent = (typeof temp === 'number') ? `${temp.toFixed(1)}°C` : '-';
            const descEl = document.createElement('div'); descEl.className = 'weather-description'; descEl.textContent = description ? (description.charAt(0).toUpperCase() + description.slice(1)) : '';
            const ul = document.createElement('ul'); ul.className = 'weather-details';
            if (typeof humidity !== 'undefined') { const li = document.createElement('li'); li.textContent = `Humidity: ${humidity}%`; ul.appendChild(li); }
            if (typeof pressure !== 'undefined') { const li2 = document.createElement('li'); li2.textContent = `Pressure: ${pressure} hPa`; ul.appendChild(li2); }
            container.appendChild(iconEl); container.appendChild(tempEl); container.appendChild(descEl); container.appendChild(ul);
            result1.appendChild(container);
        })
        .catch(function (error) {
            result1.textContent = '';
            const msg = (error.response && error.response.data && error.response.data.message) ? `Error: ${error.response.data.message}` : 'Unable to fetch weather. Please try again later.';
            const errSpan = document.createElement('span'); errSpan.className = 'error-message'; errSpan.textContent = msg;
            result1.appendChild(errSpan);
            console.error(error);
        });
}
