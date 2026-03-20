
const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherContainer = document.getElementById('weather-container');
const errorMessage = document.getElementById('error-message');

// 1. Obtener coordenadas (Geocoding)
async function getCoordinates(city) {
    const response = await fetch(`${GEO_API_URL}?name=${city}&count=1&language=es&format=json`);
    if (!response.ok) throw new Error('Error al conectar con el servidor de búsqueda.');
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error('No pudimos encontrar esa ciudad. Verifica el nombre.');
    }
    
    const { latitude, longitude, name } = data.results[0];
    return { latitude, longitude, name };
}

// 2. Obtener datos del clima
async function getWeather(lat, lon) {
    const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener los datos climáticos.');
    
    const data = await response.json();
    return data.current_weather;
}

// 3. Mapear códigos WMO a clases de FontAwesome
function getWeatherIconClass(wmoCode) {
    const iconMap = {
        0: 'fa-solid fa-sun',
        1: 'fa-solid fa-cloud-sun',
        2: 'fa-solid fa-cloud-sun',
        3: 'fa-solid fa-cloud',
        45: 'fa-solid fa-smog',
        48: 'fa-solid fa-smog',
        51: 'fa-solid fa-cloud-rain',
        53: 'fa-solid fa-cloud-rain',
        55: 'fa-solid fa-cloud-rain',
        61: 'fa-solid fa-cloud-showers-heavy',
        63: 'fa-solid fa-cloud-showers-heavy',
        65: 'fa-solid fa-cloud-showers-heavy',
        71: 'fa-solid fa-snowflake',
        73: 'fa-solid fa-snowflake',
        75: 'fa-solid fa-snowflake',
        95: 'fa-solid fa-cloud-bolt'
    };
    return iconMap[wmoCode] || 'fa-solid fa-cloud'; 
}

// 4. Renderizar la tarjeta en el HTML
function renderWeatherCard(weatherData) {
    const iconClass = getWeatherIconClass(weatherData.weatherCode);
    
    const cardHTML = `
        <div class="weather-card">
            <div class="card-header">
                <h2 class="city-name" title="${weatherData.city}">${weatherData.city}</h2>
                <i class="${iconClass} weather-icon"></i>
            </div>
            <div class="card-body">
                <div class="metric">
                    <span class="temp">${Math.round(weatherData.temperature)}°C</span>
                </div>
                <div class="details">
                    <span><i class="fa-solid fa-wind"></i> Viento: ${weatherData.windSpeed} km/h</span>
                </div>
            </div>
        </div>
    `;

    weatherContainer.insertAdjacentHTML('afterbegin', cardHTML);
}

// 5. Manejar el LocalStorage
function saveCityToLocalStorage(weatherData) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
   
    history = history.filter(item => item.city.toLowerCase() !== weatherData.city.toLowerCase());
    
    history.unshift(weatherData); 
    
    if (history.length > 8) history.pop();
    
    localStorage.setItem('weatherHistory', JSON.stringify(history));
}

function loadHistoryOnStart() {
    const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  
    history.reverse().forEach(cityData => {
        renderWeatherCard(cityData);
    });
}

// 6. Controlador Principal (Orquestador)
async function handleCitySearch() {
    const city = cityInput.value.trim();
    if (!city) return;

  
    errorMessage.classList.add('hidden');
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Buscando...';

    try {
        const location = await getCoordinates(city);
        const weather = await getWeather(location.latitude, location.longitude);
        
        const weatherData = {
            city: location.name,
            temperature: weather.temperature,
            windSpeed: weather.windspeed,
            weatherCode: weather.weathercode
        };

        renderWeatherCard(weatherData);
        saveCityToLocalStorage(weatherData);
        
        cityInput.value = '';

    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        // Restaurar el botón
        searchBtn.disabled = false;
        searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Buscar';
    }
}

// Listeners de eventos
searchBtn.addEventListener('click', handleCitySearch);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCitySearch();
    }
});

document.addEventListener('DOMContentLoaded', loadHistoryOnStart);