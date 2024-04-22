import './src/WeatherWidgetWeatherAPI.js';

window.addEventListener('DOMContentLoaded', () => {
    import('./WeatherWidgetWeatherAPI.js').then(() => {
      const widgetHTML = document.querySelector('#weather-widget').outerHTML;
      document.getElementById('app').innerHTML = widgetHTML;
    });
  });