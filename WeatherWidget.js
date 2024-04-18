// app.js
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
        case 'week':
            apiUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru&cnt=7`;
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
            // Обработка полученных данных
            const location = data.name;
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const windSpeed = data.wind.speed;
            const pressure = data.main.pressure;
            const humidity = data.main.humidity;

            // Получение текущей даты и времени
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long', year: '2-digit', hour: 'numeric', minute: 'numeric' });

            // Изменение цвета фона в зависимости от времени суток
            const isDay = data.weather[0].icon.includes('d');
            document.getElementById('weather-widget').style.backgroundColor = isDay ? '#fff' : '#ccc';

            // Обновление HTML-элементов
            document.getElementById('location').textContent = location;
            document.getElementById('temperature').textContent = `${temperature} °C`;
            document.getElementById('description').textContent = description;
            document.getElementById('weather-icon').src = `http://openweathermap.org/img/w/${iconCode}.png`;
            document.getElementById('wind-speed').textContent = `Скорость ветра: ${windSpeed} м/с`;
            document.getElementById('pressure').textContent = `Давление: ${pressure} гПа`;
            document.getElementById('humidity').textContent = `Влажность: ${humidity}%`;
            document.getElementById('date').textContent = formattedDate;
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

// Обработчик события для кнопки "Get Weather"
document.getElementById('search-btn').addEventListener('click', () => {
    const cityName = document.getElementById('city-input').value;
    getWeatherForecast(cityName);
});

// Обработчики событий для кнопок выбора прогноза
document.getElementById('current-btn').addEventListener('click', () => getWeatherForecast(null, 'current'));
document.getElementById('tomorrow-btn').addEventListener('click', () => getWeatherForecast(null, 'tomorrow'));
document.getElementById('three-days-btn').addEventListener('click', () => getWeatherForecast(null, 'three-days'));
document.getElementById('week-btn').addEventListener('click', () => getWeatherForecast(null, 'week'));

// Получение прогноза погоды для Новосибирска при загрузке страницы
getWeatherForecast();