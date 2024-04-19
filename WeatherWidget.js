const API_KEY = '160be1483cededcbe6ced1ddd0305d70';

// Функция для получения прогноза погоды по названию города
function getWeatherForecast(cityName = 'Новосибирск', forecast = 'current') {
    let apiUrl;

    switch (forecast) {
        case 'current':
            apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru`;
            break;
        case 'tomorrow':
            apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru&cnt=2`;
            break;
        case 'three-days':
            apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru&cnt=10`;
            break;
        default:
            apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru`;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            let location = data.city ? data.city.name : data.name;
            const weatherData = forecast === 'current' ? [data] : data.list;
            const weatherContainer = document.getElementById('weather-info');
            weatherContainer.innerHTML = '';

            if (forecast === 'current') {
                const currentWeather = weatherData[0];
                displayWeatherInfo(currentWeather, 'Сейчас');
            } else if (forecast === 'tomorrow') {
                const todayWeather = weatherData[0];
                const tomorrowWeather = weatherData[1];
                displayWeatherInfo(todayWeather, 'Сегодня', true, false); // Передаем true для showTemperature
                displayWeatherInfo(tomorrowWeather, 'Завтра', true, false); // Передаем false для showTemperature
            } else if (forecast === 'three-days') {
                const todayWeather = weatherData[0];
                const tomorrowWeather = weatherData[1];
                const afterTomorrowWeather = weatherData[2];
                displayWeatherInfo(todayWeather, 'Сегодня', true, false); // Передаем true для showTemperature
                displayWeatherInfo(tomorrowWeather, 'Завтра', true, false); // Передаем false для showTemperature
                displayWeatherInfo(afterTomorrowWeather, 'Послезавтра', true, false); // Передаем false для showTemperature
            } else {
                weatherData.forEach((item, index) => {
                    const forecastDate = new Date(item.dt * 1000);
                    const formattedDate = forecastDate.toLocaleDateString('ru-RU', {
                        weekday: 'short', day: 'numeric', month: 'long', year: '2-digit', hour: 'numeric', minute: 'numeric'
                    });
                    displayWeatherInfo(item, formattedDate);
                });
            }

            // Изменение цвета фона в зависимости от времени суток
            const isDay = weatherData[0].weather[0].icon.includes('d');
            document.getElementById('weather-widget').style.backgroundColor = isDay ? '#fff' : '#ccc';
        })
        .catch(error => {
            if (error.message.includes('404')) {
                alert(`Город "${cityName}" не найден. Пожалуйста, проверьте правильность ввода названия города.`);
            } else {
                console.error('Error:', error);
                alert(`Произошла ошибка при получении данных о погоде: ${error.message}`);
            }
        });
}

function displayWeatherInfo(weatherData, title, showMinMax = false, showTemperature = true) {
    const temperature = weatherData.main.temp;
    const description = weatherData.weather[0].description;
    const iconCode = weatherData.weather[0].icon;
    const windSpeed = weatherData.wind.speed;
    const pressure = weatherData.main.pressure;
    const humidity = weatherData.main.humidity;
    const minTemp = weatherData.main.temp_min;
    const maxTemp = weatherData.main.temp_max;

    const weatherInfo = document.createElement('div');
    weatherInfo.className = 'weather-item';
    weatherInfo.innerHTML = `
        <div>${title}</div>
        ${showTemperature ? `<div>${temperature} °C</div>` : ''}
        <div>${description}</div>
        <img src="http://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
        <div>Скорость ветра: ${windSpeed} м/с</div>
        <div>Давление: ${pressure} гПа</div>
        <div>Влажность: ${humidity}%</div>
        ${showMinMax ? `<div>Max: ${minTemp} °C</div>` : ''}
        ${showMinMax ? `<div>Min: ${maxTemp} °C</div>` : ''}
    `;
    document.getElementById('weather-info').appendChild(weatherInfo);
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
getWeatherForecast();