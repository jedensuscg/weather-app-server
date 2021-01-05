/**
 * Created by James Edens. Inspired by the Udemy course located at
 * https://www.udemy.com/course/the-complete-nodejs-developer-course-2/
 * Credit goes to Andrew Mead for the inspiration. Mead.io
 */

console.log('Client Side Javascript loaded');

const WeatherContent = document.querySelector('#weather-content');
const forecastWeatherContent = document.querySelector('#forcast-weather-content');
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const time = document.querySelector('#hours-range')
const weatherHead = document.querySelector('#weather-head');
const currentTemp = document.querySelector('#current-temp');
const feelsLike = document.querySelector('#feels-like')
const currentWinds = document.querySelector('#current-winds');
const precip = document.querySelector('#precip');
const humidity = document.querySelector('#humidity');
const weatherCode = document.querySelector('#weather-code');
const hoursSlider = document.querySelector('#hours-range');
const hoursLabel = document.querySelector('#hours-label');
const forecastWeatherHeader = document.querySelector('#forecast-weather-head');
const forecastTemp = document.querySelector('#forecast-temp');
const betweenForecastHR = document.createElement('hr');

const forecastPrecipChance = document.querySelector('#forecast-precip-chance');


hoursLabel.innerHTML = hoursSlider.value + " Hours";
hoursSlider.oninput = function () {
    hoursLabel.innerHTML = this.value + " Hours";
}

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const location = search.value;
    const hours = (time.value) - 1;

    weatherHead.textContent = 'Loading Weather';
    currentTemp.textContent = '';
    currentWinds.textContent = '';
    precip.textContent = '';
    feelsLike.textContent = '';
    humidity.textContent = '';
    weatherCode.textContent = '';
    betweenForecastHR.remove();

    fetch(`/weather?address=${location}&time=${hours + 2}`).then((response) => {
        response.json().then((data) => {
            const {
                geocode,
                currentForecast,
                futureForecast
            } = data;
            WeatherContent.classList.add("weather-border")

            if (data.errorMsg) {
                weatherHead.textContent = 'ERROR';
                currentTemp.textContent = `${data.errorMsg}`;
            } else {
                displayCurrentWeather(geocode, currentForecast);

                displayForecastWeather(geocode, futureForecast);
            };
        });
    });
})

function capitalize(string) {

    return string.charAt(0).toUpperCase() + string.slice(1);
}

function normalizeString(string) {
    str = string.replace('_', " ")
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function displayCurrentWeather(geocode, currentForecast) {
    weatherHead.textContent = `Your Current Weather for ${geocode.Location}`;
    weatherCode.textContent = `Conditions: ${normalizeString(currentForecast.weatherCode)}`;
    currentTemp.textContent = `Temperature: ${Math.ceil(currentForecast.temp)}${currentForecast.units}`;
    feelsLike.textContent = `Feels Like: ${Math.ceil(currentForecast.feelsLike)}${currentForecast.units}`;
    currentWinds.textContent = `Winds: ${currentForecast.cardinalWindHeading} at ${Math.ceil(currentForecast.windSpeed)} ${currentForecast.windUnits}`
    humidity.textContent = `Humidity: ${currentForecast.humidity}%`;
    if (currentForecast.precipitationType != null) {
        precip.textContent = `Precipitation: ${capitalize(currentForecast.precipWord)} ${capitalize(currentForecast.precipitationType)} (${currentForecast.precipitation} ${currentForecast.precipitationUnits})`;
    } else {
        precip.textContent = `Precipitation: There is currently no precipitation`;
    };
}

function displayForecastWeather(geocode, futureForecast) {
    forecastWeatherContent.insertBefore(betweenForecastHR, forecastWeatherHeader)
    forecastPrecipChance.before(createForecastList(futureForecast))

    if (futureForecast.rainChanceIn24Hours < 1) {
        forecastPrecipChance.textContent = 'No rain is forecasted for the next 24 hours.';
    } else {
        forecastPrecipChance.textContent = `Chance of rain at observation time: ${futureForecast.rainChance}%. There is a ${futureForecast.rainChanceIn24Hours}% chance of rain in the next 24 hours.`;
    };
}

function createForecastList({
    hourWeather: hours
}) {
    const lineBreak = document.createElement('br')


    const tempImg = createWeatherIcon("/img/temperature.svg", "25", "temp guage")
    const rainDropImg = createWeatherIcon("/img/drop.svg", "15", "rain drop")


    let hourList = document.createElement('div')
    hourList.className = "forecast-hourly-div"



    for (let hour = 0; hour < hours.length; hour++) {
        let timeH4 = document.createElement('h4')
        timeH4.className = "forecast-hour-time"
        let tempP = document.createElement('span')
        tempP.className = "forecast-hour-temp"
        let rainP = document.createElement('span')
        rainP.className = "forecast-hour-rain"
        let hourDiv = document.createElement('div')
        hourDiv.className = "forecast-hour-div"
        let hourData = hours[hour]

        timeH4.appendChild(document.createTextNode(hourData.time))
        tempP.appendChild(document.createTextNode(hourData.temp))

        rainP.appendChild(document.createTextNode(hourData.rainChanceAtHour))
        hourDiv.appendChild(timeH4)
        hourDiv.appendChild(tempImg.cloneNode(true))
        hourDiv.appendChild(tempP)
        hourDiv.appendChild(lineBreak.cloneNode(true))
        hourDiv.appendChild(rainDropImg.cloneNode(true))
        hourDiv.appendChild(rainP)



        hourList.appendChild(hourDiv)
    }

    return hourList;
}

/**
 * 
 * @param {string} src icon src
 * @param {string} width desired width
 * @param {string} alt alt text for image
 */
function createWeatherIcon(src, width, alt) {
    let Img = document.createElement('img');
    Img.setAttribute("src", src);
    Img.setAttribute("width", width);
    Img.setAttribute("height", width);
    Img.setAttribute("alt", alt);

    return Img
}