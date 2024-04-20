# Погодный Виджет

Это веб-виджет, который позволяет получать актуальную информацию о погоде для любого города. Виджет предоставляет данные о текущих погодных условиях, а также прогноз на два или три дня вперед. 

## Запуск

1. Убедитесь, что у вас установлен локальный веб-сервер (например, Live Server для Visual Studio Code или любой другой веб-сервер).

2. Создайте новую папку для проекта и поместите в нее следующие файлы:
   - `WeatherWidget.html`
   - `WeatherWidget.css`
   - `WeatherWidget.js`

3. Откройте `WeatherWidget.js` и замените значение `API_KEY` на свой действительный ключ API, полученный от сервиса WeatherAPI.

4. Запустите локальный веб-сервер и откройте `WeatherWidget.html` в браузере. Вы должны увидеть работающий веб-виджет для прогноза погоды.

## Импорт в другое веб-приложение

1. Создайте две дополнительные папки: `src` и `dist`.

2. Поместите `WeatherWidget.css` и `WeatherWidget.js` в папку `src`.

3. В корневой папке проекта создайте файлы `app.js` и `index.html` со следующим содержимым:

```javascript
// app.js
import './src/WeatherWidget.js';

window.addEventListener('DOMContentLoaded', () => {
  import('./src/WeatherWidget.js').then(() => {
    const widgetHTML = document.querySelector('#weather-widget').outerHTML;
    document.getElementById('app').innerHTML = widgetHTML;
  });
});
```
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="NSTU.icon" />
  <title>Веб-приложение</title>
  <link rel="stylesheet" href="/src/WeatherWidget.css">
</head>

<body>

  <div id="app"></div>
  <script type="module" src="app.js"></script>
  
</body>
</html>
```
4. Запустите локальный веб-сервер и откройте index.html в браузере. Вы должны увидеть веб-виджет для прогноза погоды, встроенный в ваше веб-приложение.


Файл app.js динамически импортирует код виджета из WeatherWidget.js и добавляет HTML-код виджета в элемент с идентификатором app на странице index.html.
Файл index.html содержит ссылку на стили WeatherWidget.css и подключает app.js в качестве модульного сценария.
Теперь веб-виджет для прогноза погоды успешно интегрирован в ваше веб-приложение или сайт. Вы можете кастомизировать его стили и функциональность, редактируя файлы WeatherWidget.css и WeatherWidget.js.
