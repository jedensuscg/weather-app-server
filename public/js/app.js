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
    forecastWeatherHeader.textContent = "";
    forecastTemp.textContent = "";
    forecastPrecipChance.textContent = "";
    betweenForecastHR.remove();

    fetch(`/weather?address=${location}&time=${hours + 2}`).then((response) => {
        response.json().then((data) => {
            const { geocode, currentForecast, futureForecast } = data;
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
    forecastWeatherHeader.textContent = `Your Forecasted Weather at ${futureForecast.observationTimeLocal} (${futureForecast.newHoursFromNow.hours} hours, ${futureForecast.newHoursFromNow.minutes} minutes from now.)`;
    forecastTemp.textContent = `The temperature will be ${Math.ceil(futureForecast.temp)}${futureForecast.units}`;
    if (futureForecast.rainChanceIn24Hours < 1) {
        console.log(futureForecast.rainChanceIn24Hours)
        forecastPrecipChance.textContent = 'No rain is forecasted for the next 24 hours.';
    } else {
        forecastPrecipChance.textContent = `Chance of rain at observation time: ${futureForecast.rainChance}%. There is a ${futureForecast.rainChanceIn24Hours}% chance of rain in the next 24 hours.`;
    };
}

