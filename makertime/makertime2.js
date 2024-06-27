const apiKey = '4cabc006efc351a1ef4250a77fe2cf81'; 

async function fetchWeather(city = document.getElementById('locationSelect').value) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=uk&appid=${apiKey}`);
        if (!response.ok) throw new Error('Місто не знайдено');
        const data = await response.json();
        updateUI(data);
        fetchForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        errorMessage.textContent = error.message;
    }
}

async function fetchForecast(lat, lon) {
    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=24&units=metric&lang=uk&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();
    updateForecastUI(forecastData);
}

function updateUI(data) {
    const weatherInfo = document.getElementById('weatherInfo');
    const cityName = document.getElementById('cityName');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');

    cityName.textContent = data.name;
    temperature.textContent = `Температура: ${data.main.temp} °C`;
    description.textContent = `Опис: ${data.weather[0].description}`;

    weatherInfo.style.display = 'block';

    updateBackground(data.weather[0].main.toLowerCase());
}

function updateForecastUI(data) {
    const forecastInfo = document.getElementById('forecastInfo');
    forecastInfo.innerHTML = '<h2>Прогноз на 3 дні</h2>';
    let forecasts = {};


    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('uk-UA');
        if (!forecasts[date]) {
            forecasts[date] = [];
        }
        forecasts[date].push(item);
    });


    Object.keys(forecasts).slice(0, 3).forEach(date => {
        const dayForecasts = forecasts[date];
        const averageTemp = (dayForecasts.reduce((sum, item) => sum + item.main.temp, 0) / dayForecasts.length).toFixed(1);
        const description = dayForecasts[0].weather[0].description;

        forecastInfo.innerHTML += `
            <div class="forecast-day">
                <p>${date}</p>
                <p>Температура: ${averageTemp} °C</p>
                <p>Опис: ${description}</p>
            </div>
        `;
    });

    forecastInfo.style.display = 'block';
}

function updateBackground(weatherCondition) {
    const body = document.body;

    body.className = '';
    if (weatherCondition.includes('clear')) {
        body.classList.add('sunny');
    } else if (weatherCondition.includes('clouds')) {
        body.classList.add('cloudy');
    } else if (weatherCondition.includes('rain')) {
        body.classList.add('rainy');
    } else if (weatherCondition.includes('snow')) {
        body.classList.add('snowy');
    } else {
        body.classList.add('cloudy');
    }
}

function searchCity() {
    const cityInput = document.getElementById('cityInput').value;
    fetchWeather(cityInput);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
});