const API_KEY = 'd53d580c-7fd0-40b5-859a-cde45d3033b6';
const TOKEN_HEADER = 'X-Gismeteo-Token';

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  return hours;
}

function getWeatherForecast(cityName = 'Новосибирск', forecast = 'current') {
    const headers = { [TOKEN_HEADER]: API_KEY };
    const searchUrl = `https://api.gismeteo.net/v3/search/cities/?query=${cityName}`;

    fetch({ headers }, searchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.response.count > 0) {
                const city = data.response.items[0];
                const latitude = city.latitude;
                const longitude = city.longitude;

                let apiUrl;

                switch (forecast) {
                    case 'current':
                        apiUrl = `https://api.gismeteo.net/v3/search/cities/?query=${cityName}`;
                        break;
                    case 'tomorrow':
                        apiUrl = `https://api.gismeteo.net/v3/search/cities/?query=${cityName}`;
                        break;
                    case 'three-days':
                        apiUrl = `https://api.gismeteo.net/v3/search/cities/?query=${cityName}`;
                        break;
                    default:
                        apiUrl = `https://api.gismeteo.net/v3/search/cities/?query=${cityName}`;
                }

                fetchWeatherData(apiUrl, headers, cityName, forecast);
            } else {
                console.error('Город не найден');
                alert('Не удалось найти указанный город. Пожалуйста, проверьте правильность написания');
            }
        })
        .catch(error => {
            console.error('Ошибка при получении данных о городе:', error);
            alert('Произошла ошибка при получении данных о городе. Пожалуйста, попробуйте позже');
        });
}

function fetchWeatherData(apiUrl, headers, cityName, forecast) {
    fetch(apiUrl, { headers })
        .then(response => response.json())
        .then(data => {
            const weatherContainer = document.getElementById('weather-info');
            weatherContainer.innerHTML = '';

            if (data.response) {
                if (forecast === 'current') {
                    const currentWeather = data.response.weather;
                    displayWeatherInfo(currentWeather, 'Сейчас');
                    setBackgroundColor();
                } else if (forecast === 'tomorrow') {
                    const todayWeather = data.response.forecast[0];
                    const tomorrowWeather = data.response.forecast[1];
                    displayWeatherInfoForDay(todayWeather, 'Сегодня', true, true);
                    displayWeatherInfoForDay(tomorrowWeather, 'Завтра', true, true);
                    setBackgroundColor();
                } else if (forecast === 'three-days') {
                    const todayWeather = data.response.forecast[0];
                    const tomorrowWeather = data.response.forecast[1];
                    const afterTomorrowWeather = data.response.forecast[2];
                    displayWeatherInfoForDay(todayWeather, 'Сегодня', true, true);
                    displayWeatherInfoForDay(tomorrowWeather, 'Завтра', true, true);
                    displayWeatherInfoForDay(afterTomorrowWeather, 'Послезавтра', true, true);
                    setBackgroundColor();
                }
            } else {
                alert(`Не удалось получить данные о погоде для города ${cityName}`);
            }
        })
        .catch(error => {
            console.error('Ошибка при получении данных о погоде:', error);
            alert('Произошла ошибка при получении данных о погоде. Пожалуйста, попробуйте позже');
        });
}




function displayWeatherInfo(weatherData, title) {
    const temperature = weatherData.temp;
    const description = weatherData.description;
    const iconUrl = `https://staticmaps.gismeteo.ru/images/icons/30_3/${weatherData.icon}.svg`;
    const windSpeed = weatherData.wind.speed;
    const precipitation = weatherData.precipitation.total || 0;
    const humidity = weatherData.humidity;

    const weatherInfo = document.createElement('div');
    weatherInfo.className = 'weather-item';
    weatherInfo.innerHTML = `
        <div>${title}</div>
        <div>${temperature} °C</div>
        <div>${description}</div>
        <img src="${iconUrl}" alt="Weather Icon">
        <div>Скорость ветра: ${windSpeed} м/с</div>
        <div>Количество осадков: ${precipitation} мм</div>
        <div>Влажность: ${humidity}%</div>
    `;
    document.getElementById('weather-info').appendChild(weatherInfo);
}

function displayWeatherInfoForDay(weatherData, title, showMinMax, showPrecipitation) {
    const description = weatherData.description;
    const iconUrl = `https://staticmaps.gismeteo.ru/images/icons/30_3/${weatherData.icon}.svg`;
    const windSpeed = weatherData.wind.max_speed;
    const precipitation = weatherData.precipitation.total || 0;
    const humidity = weatherData.humidity.max;
    const minTemp = Math.round(weatherData.temp.min);
    const maxTemp = Math.round(weatherData.temp.max);

    const weatherInfo = document.createElement('div');
    weatherInfo.className = 'weather-item';
    weatherInfo.innerHTML = `
        <div>${title}</div>
        <div>${description}</div>
        <img src="${iconUrl}" alt="Weather Icon">
        <div>Скорость ветра: ${windSpeed} м/с</div>
        ${showPrecipitation ? `<div>Количество осадков: ${precipitation} мм</div>` : ''}
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
function createWeatherWidget() {
    const weatherWidget = document.createElement('div');
    weatherWidget.id = 'weather-widget';

    const cityInput = document.createElement('input');
    cityInput.type = 'text';
    cityInput.id = 'city-input';
    cityInput.placeholder = 'Введите название города';
    cityInput.value = 'Новосибирск';

    const searchBtn = document.createElement('button');
    searchBtn.id = 'search-btn';
    searchBtn.textContent = 'Получить Погоду';

    const weatherInfo = document.createElement('div');
    weatherInfo.id = 'weather-info';

    const forecastOptions = document.createElement('div');
    forecastOptions.id = 'forecast-options';

    const currentBtn = document.createElement('button');
    currentBtn.id = 'current-btn';
    currentBtn.textContent = 'Сейчас';

    const tomorrowBtn = document.createElement('button');
    tomorrowBtn.id = 'tomorrow-btn';
    tomorrowBtn.textContent = '2 дня';

    const threeDaysBtn = document.createElement('button');
    threeDaysBtn.id = 'three-days-btn';
    threeDaysBtn.textContent = '3 Дня';

    weatherWidget.appendChild(cityInput);
    weatherWidget.appendChild(searchBtn);
    weatherWidget.appendChild(weatherInfo);
    forecastOptions.appendChild(currentBtn);
    forecastOptions.appendChild(tomorrowBtn);
    forecastOptions.appendChild(threeDaysBtn);
    weatherWidget.appendChild(forecastOptions);

    document.body.appendChild(weatherWidget);

    // Обработчик события для кнопки "Получить Погоду"
    searchBtn.addEventListener('click', () => {
        const cityName = cityInput.value;
        getWeatherForecast(cityName);
    });

    // Обработчики событий для кнопок выбора прогноза
    currentBtn.addEventListener('click', () => {
        const cityName = cityInput.value;
        getWeatherForecast(cityName, 'current');
    });

    tomorrowBtn.addEventListener('click', () => {
        const cityName = cityInput.value;
        getWeatherForecast(cityName, 'tomorrow');
    });

    threeDaysBtn.addEventListener('click', () => {
        const cityName = cityInput.value;
        getWeatherForecast(cityName, 'three-days');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    createWeatherWidget();
    setBackgroundColor();
    getWeatherForecast();

    // Обновление цвета фона каждую минуту
    setInterval(setBackgroundColor, 60000);
});