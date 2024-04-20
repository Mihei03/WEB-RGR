const API_KEY = 'acd1b700fc9b45789ec205720241904'; // Замените на ваш ключ API

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  return hours;
}

function getWeatherForecast(cityName = 'Новосибирск', forecast = 'current') {
    let apiUrl;

    switch (forecast) {
        case 'current':
            apiUrl = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}&lang=ru`;
            break;
        case 'tomorrow':
            apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2&lang=ru`;
            break;
        case 'three-days':
            apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=3&lang=ru`;
            break;
        default:
            apiUrl = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}&lang=ru`;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const weatherContainer = document.getElementById('weather-info');
            weatherContainer.innerHTML = '';

            if (forecast === 'current') {
                const currentWeather = data.current;
                displayWeatherInfo(currentWeather, 'Сейчас');
                setBackgroundColor();
            } else if (forecast === 'tomorrow') {
                const todayWeather = data.forecast.forecastday[0];
                const tomorrowWeather = data.forecast.forecastday[1];
                displayWeatherInfoForDay(todayWeather, 'Сегодня', true, true);
                displayWeatherInfoForDay(tomorrowWeather, 'Завтра', true, true);
                setBackgroundColor();
            } else if (forecast === 'three-days') {
                const todayWeather = data.forecast.forecastday[0];
                const tomorrowWeather = data.forecast.forecastday[1];
                const afterTomorrowWeather = data.forecast.forecastday[2];
                displayWeatherInfoForDay(todayWeather, 'Сегодня', true, true);
                displayWeatherInfoForDay(tomorrowWeather, 'Завтра', true, true);
                displayWeatherInfoForDay(afterTomorrowWeather, 'Послезавтра', true, true);
                setBackgroundColor();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Произошла ошибка при получении данных о погоде: ${error.message}`);
        });
}

function displayWeatherInfo(weatherData, title) {
    const temperature = weatherData.temp_c;
    const description = weatherData.condition.text;
    const iconUrl = `http:${weatherData.condition.icon}`;
    const windSpeed = (weatherData.wind_kph * 1000 / 3600).toFixed(1);
    const precipitation = weatherData.precip_mm;
    const humidity = weatherData.humidity;

    const weatherInfo = document.createElement('div');
    weatherInfo.className = 'weather-item';
    weatherInfo.innerHTML = `
        <div>${title}</div>
        <div>${temperature} °C</div>
        <div>${description}</div>
        <img src="${iconUrl}" alt="Weather Icon">
        <div>Скорость ветра: ${windSpeed} м/с</div>
        <div>Кол-во осадков: ${precipitation} мм</div>
        <div>Влажность: ${humidity}%</div>
    `;
    document.getElementById('weather-info').appendChild(weatherInfo);
}

function displayWeatherInfoForDay(weatherData, title, showMinMax, showPrecipitation) {
    const description = weatherData.day.condition.text;
    const iconUrl = `http:${weatherData.day.condition.icon}`;
    const windSpeed = (weatherData.day.maxwind_kph * 1000 / 3600).toFixed(1);
    const precipitation = weatherData.day.totalprecip_mm;
    const humidity = weatherData.day.avghumidity;
    const minTemp = Math.round(weatherData.day.mintemp_c);
    const maxTemp = Math.round(weatherData.day.maxtemp_c);

    const weatherInfo = document.createElement('div');
    weatherInfo.className = 'weather-item';
    weatherInfo.innerHTML = `
        <div>${title}</div>
        <div>${description}</div>
        <img src="${iconUrl}" alt="Weather Icon">
        <div>Скорость ветра: ${windSpeed} м/с</div>
        ${showPrecipitation ? `<div>Кол-во осадков: ${precipitation} мм</div>` : ''}
        <div>Влажность: ${humidity}%</div>
        ${showMinMax ? `<div>Max: ${maxTemp} °C</div>` : ''}
        ${showMinMax ? `<div>Min: ${minTemp} °C</div>` : ''}
    `;
    document.getElementById('weather-info').appendChild(weatherInfo);
}

function setBackgroundColor() {
    const weatherWidget = document.getElementById('weather-widget');
    const currentWidget = document.getElementById('current-btn');
    const tomorrowWidget = document.getElementById('tomorrow-btn');
    const threeDaysWidget = document.getElementById('three-days-btn');
    const searchWidget = document.getElementById('search-btn');
    const hours = getCurrentTime();
  
    if (hours >= 6 && hours < 18) {
      weatherWidget.style.backgroundColor = '#fff';
      currentWidget.style.backgroundColor = '#00d9ff';
      tomorrowWidget.style.backgroundColor = '#00d9ff';
      threeDaysWidget.style.backgroundColor = '#00d9ff';
      searchWidget.style.backgroundColor = '#00d9ff';
    } else {
      weatherWidget.style.backgroundColor = '#333';
      currentWidget.style.backgroundColor = '#e100ff';
      tomorrowWidget.style.backgroundColor = '#e100ff';
      threeDaysWidget.style.backgroundColor = '#e100ff';
      searchWidget.style.backgroundColor = '#e100ff';
    }
  }

// Обработчик события для кнопки "Get Weather"
document.getElementById('search-btn').addEventListener('click', () => {
    const cityName = document.getElementById('city-input').value;
    getWeatherForecast(cityName);
});

// Обработчики событий для кнопок выбора прогноза
document.getElementById('current-btn').addEventListener('click', () => {
    const cityName = document.getElementById('city-input').value;
    getWeatherForecast(cityName, 'current');
});

document.getElementById('tomorrow-btn').addEventListener('click', () => {
    const cityName = document.getElementById('city-input').value;
    getWeatherForecast(cityName, 'tomorrow');
});

document.getElementById('three-days-btn').addEventListener('click', () => {
    const cityName = document.getElementById('city-input').value;
    getWeatherForecast(cityName, 'three-days');
});

// Получение прогноза погоды для Новосибирска при загрузке страницы
window.onload = function() {
    setBackgroundColor();
    getWeatherForecast();

    // Обновление цвета фона каждую минуту
    setInterval(setBackgroundByTime, 60000);
};