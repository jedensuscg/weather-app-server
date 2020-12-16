console.log('Client Side Javascript loaded');


const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const weatherHead = document.querySelector('#weather-head');
const currentTemp = document.querySelector('#current-temp');
const feelsLike = document.querySelector('#feels-like')
const currentWinds = document.querySelector('#current-winds');
const precip = document.querySelector('#precip');
const humidity = document.querySelector('#humidity');




weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const location = search.value;

    weatherHead.textContent = 'Loading Weather';
    currentTemp.textContent = '';
    currentWinds.textContent = '';
    precip.textContent = '';
    feelsLike.textContent = '';
    humidity.textContent = '';

    fetch(`http://localhost:3000/weather?address=${location}`).then((response) => {
        response.json().then((data) => {
            const { geocode, currentForecast, futureForecast } = data;
            console.log(data);

            if (data.errorMsg) {
                weatherHead.textContent = 'ERROR';
                currentTemp.textContent = `${data.errorMsg}`;
            } else {
                weatherHead.textContent = `Your Current Weather for ${geocode.Location}`;
                currentTemp.textContent = `Temperature: ${Math.ceil(currentForecast.temp)}${currentForecast.units}`;
                feelsLike.textContent = `Feels Like: ${Math.ceil(currentForecast.feelsLike)}${currentForecast.units}`;
                currentWinds.textContent = `Winds: ${currentForecast.cardinalWindHeading} at ${Math.ceil(currentForecast.windSpeed)} ${currentForecast.windUnits}`
                humidity.textContent = `Humidity: ${currentForecast.humidity}%`;
                if (currentForecast.precipitationType != "none") {
                    precip.textContent = `Precipitation: ${capitalize(currentForecast.precipWord)} ${capitalize(currentForecast.precipitationType)} (${currentForecast.precipitation} ${currentForecast.precipitationUnits})`;
                } else {
                    precip.textContent = `Precipitation: There is currently no precipitation`;
                };

            };
        });
    });
})

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}