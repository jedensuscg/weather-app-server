$(document).ready(function () {
    console.log('Client Side Javascript loaded');


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
    const hoursSlider = document.querySelector('#hours-range')
    const hoursLabel = document.querySelector('#hours-label')

    hoursLabel.innerHTML = hoursSlider.value;
    hoursSlider.oninput = function () {
        hoursLabel.innerHTML = this.value;
    }

    weatherForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const location = search.value;
        const hours = time.value;

        weatherHead.textContent = 'Loading Weather';
        currentTemp.textContent = '';
        currentWinds.textContent = '';
        precip.textContent = '';
        feelsLike.textContent = '';
        humidity.textContent = '';
        weatherCode.textContent = '';
        $('#forecast-weather-head').text(``);
        $('#forecast-temp').text("");
        $("#between-forcasts").remove();
        $('#forecast-precip-chance').text('');

        fetch(`http://localhost:3000/weather?address=${location}&time=${hours}`).then((response) => {
            response.json().then((data) => {
                const { geocode, currentForecast, futureForecast } = data;

                $("#weather-content").addClass("weather-border")

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
        if (currentForecast.precipitationType != "none") {
            precip.textContent = `Precipitation: ${capitalize(currentForecast.precipWord)} ${capitalize(currentForecast.precipitationType)} (${currentForecast.precipitation} ${currentForecast.precipitationUnits})`;
        } else {
            precip.textContent = `Precipitation: There is currently no precipitation`;
        };
        $('#precip').after("<hr id='between-forcasts'>")
    }

    function displayForecastWeather(geocode, futureForecast) {
        $('#forecast-weather-head').text(`Your Forecasted Weather at ${futureForecast.observationTimeLocal} (${futureForecast.newHoursFromNow.hours} hours, ${futureForecast.newHoursFromNow.minutes} minutes from now.)`);
        $('#forecast-temp').text(`The temperature ${futureForecast.hoursFromNow} hours from now will be ${futureForecast.temp}${futureForecast.units}`)
        if (futureForecast.rainChanceIn24Hours < 1) {
            console.log(futureForecast.rainChanceIn24Hours)
            $('#forecast-precip-chance').text('No rain is forecasted for the next 24 hours.');
        } else {
            $('#forecast-precip-chance').text(`Chance of rain at observation time: ${futureForecast.rainChance}%\n But there is a ${futureForecast.rainChanceIn24Hours}% chance of rain in the next 24 hours.`);
        };
    }
});

