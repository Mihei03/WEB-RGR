import './src/WeatherWidget.js';

window.addEventListener('DOMContentLoaded', () => {
    import('./WeatherWidget.js').then(() => {
      const widgetHTML = document.querySelector('#weather-widget').outerHTML;
      document.getElementById('app').innerHTML = widgetHTML;
    });
  });




  