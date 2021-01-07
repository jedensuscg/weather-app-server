/**
 * Created by James Edens. Inspired by the Udemy course located at
 * https://www.udemy.com/course/the-complete-nodejs-developer-course-2/
 * Credit goes to Andrew Mead for the inspiration. Mead.io
 */

console.log('Client Side Javascript loaded');

const WeatherContent = document.querySelector('#weather-content');
const forecastWeatherContent = document.querySelector(
    '#forcast-weather-content',
);
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const time = document.querySelector('#hours-range');
const weatherHead = document.querySelector('#weather-head');
const currentTemp = document.querySelector('#current-temp');
const feelsLike = document.querySelector('#feels-like');
const currentWinds = document.querySelector('#current-winds');
const precip = document.querySelector('#precip');
const humidity = document.querySelector('#humidity');
const weatherCode = document.querySelector('#weather-code');

const forecastWeatherHeader = document.querySelector('#forecast-weather-head');
const forecastTemp = document.querySelector('#forecast-temp');
const betweenForecastHR = document.createElement('hr');
let hourListDiv = undefined;

const forecastPrecipChance = document.querySelector('#forecast-precip-chance');



weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('running fetch');
  const location = search.value;

  clearPreviousSearch();

  fetch(`/weather?address=${location}`).then((response) => {
    response.json().then((data) => {
      const {geocode, currentForecast, futureForecast} = data;
      WeatherContent.classList.add('weather-border');

      if (data.errorMsg) {
        weatherHead.textContent = 'ERROR';
        currentTemp.textContent = `${data.errorMsg}`;
      } else {
        displayCurrentWeather(geocode, currentForecast);

        displayForecastWeather(geocode, futureForecast);
      }
    });
  });
});

/**
 * @description Capitalize the first word of a string.
 * @param {string} string String to capitalize first word.
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/** 
 * @description Removes underscores and capitalizes first word of string.
 * @param {string} string String to normalize
 */
function normalizeString(string) {
  str = string.replace('_', ' ');
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 
 * @param {object} geocode Object containing geocode data
 * @see {@link module:geocode} for how geocode data is obtained.
 * @param {object} currentForecast object containing current forecast data
 * @see {@link module:currentForecast} for how current forecast data is retrieved.
 */
function displayCurrentWeather(geocode, currentForecast) {
  weatherHead.textContent = `Your Current Weather for ${geocode.Location}`;
  weatherCode.textContent = `Conditions: ${normalizeString(
      currentForecast.weatherCode,
  )}`;
  currentTemp.textContent = `Temperature: ${Math.ceil(currentForecast.temp)}${
    currentForecast.units
  }`;
  feelsLike.textContent = `Feels Like: ${Math.ceil(currentForecast.feelsLike)}${
    currentForecast.units
  }`;
  currentWinds.textContent = `Winds: ${
    currentForecast.cardinalWindHeading
  } at ${Math.ceil(currentForecast.windSpeed)} ${currentForecast.windUnits}`;
  humidity.textContent = `Humidity: ${currentForecast.humidity}%`;
  if (currentForecast.precipitationType != null) {
    precip.textContent = `Precipitation: ${capitalize(
        currentForecast.precipWord,
    )} ${capitalize(currentForecast.precipitationType)} (${
      currentForecast.precipitation
    } ${currentForecast.precipitationUnits})`;
  } else {
    precip.textContent = `Precipitation: There is currently no precipitation`;
  }
}

function displayForecastWeather(geocode, futureForecast) {
  forecastWeatherContent.insertBefore(betweenForecastHR, forecastWeatherHeader);
  hourListDiv = createForecastList(futureForecast);
  forecastPrecipChance.before(hourListDiv);

  if (futureForecast.rainChanceIn24Hours < 1) {
    forecastPrecipChance.textContent =
      'No rain is forecasted for the next 24 hours.';
  } else {
    forecastPrecipChance.textContent = `There is a ${futureForecast.rainChanceIn24Hours}% chance of rain in the next 24 hours.`;
  }
}

function createForecastList({hourWeather: hours}) {
  const lineBreak = document.createElement('br');
  console.log('hours lenght: ' + hours.length);
  console.log('creating nodes');

  const tempImg = createWeatherIcon('/img/temperature.svg', '25', 'temp guage');
  const rainDropImg = createWeatherIcon('/img/drop.svg', '15', 'rain drop');

  const hourList = document.createElement('div');
  console.log('hour list before: ' + hourList.childElementCount);
  hourList.className = 'forecast-hourly-div';
  hourList.id = 'hour-list';

  for (let hour = 0; hour < hours.length; hour++) {
    const timeH4 = document.createElement('h4');
    timeH4.className = 'forecast-hour-time';
    const tempP = document.createElement('span');
    tempP.className = 'forecast-hour-temp';
    const rainP = document.createElement('span');
    rainP.className = 'forecast-hour-rain';
    const hourDiv = document.createElement('div');
    hourDiv.className = 'forecast-hour-div';
    const hourData = hours[hour];

    timeH4.appendChild(document.createTextNode(hourData.time));
    tempP.appendChild(document.createTextNode(hourData.temp));

    rainP.appendChild(document.createTextNode(hourData.rainChanceAtHour));
    hourDiv.appendChild(timeH4);
    hourDiv.appendChild(tempImg.cloneNode(true));
    hourDiv.appendChild(tempP);
    hourDiv.appendChild(lineBreak.cloneNode(true));
    hourDiv.appendChild(rainDropImg.cloneNode(true));
    hourDiv.appendChild(rainP);

    hourList.appendChild(hourDiv);
  }
  console.log('hourList ' + hourList.childElementCount);
  return hourList;
}

/**
 *
 * @param {string} src icon src
 * @param {string} width desired width
 * @param {string} alt alt text for image
 */
function createWeatherIcon(src, width, alt) {
  const Img = document.createElement('img');
  Img.setAttribute('src', src);
  Img.setAttribute('width', width);
  Img.setAttribute('height', width);
  Img.setAttribute('alt', alt);

  return Img;
}

/**
 *
 * @param {string} parent Parent of children to remove from DOM
 */
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function clearPreviousSearch() {
  weatherHead.textContent = 'Loading Weather';
  currentTemp.textContent = '';
  currentWinds.textContent = '';
  precip.textContent = '';
  feelsLike.textContent = '';
  humidity.textContent = '';
  weatherCode.textContent = '';
  betweenForecastHR.remove();
  if (hourListDiv != null) {
    removeAllChildNodes(hourListDiv);
    hourListDiv.remove();
  }
}
