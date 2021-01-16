/**
 * @namespace ClientSide
 * @description Client Side Javascript
 */
/**
 * Created by James Edens. Inspired by the Udemy course located at
 * https://www.udemy.com/course/the-complete-nodejs-developer-course-2/
 * Credit goes to Andrew Mead for the inspiration. Mead.io
 */

console.log("Client Side Javascript loaded");

// #region DECLARATIONS

const weatherContent = document.querySelector("#weather-content");
const forecastWeatherContent = document.querySelector("#forecast-weather-content");
const dailyForecastContent = document.querySelector('#forecast-daily-content');
const weatherForm = document.querySelector("form");
const search = document.querySelector("input");
const weatherHead = document.querySelector("#weather-head");
const currentTemp = document.querySelector("#current-temp");
const feelsLike = document.querySelector("#feels-like");
const currentWinds = document.querySelector("#current-winds");
const precip = document.querySelector("#precip");
const humidity = document.querySelector("#humidity");
const weatherCode = document.querySelector("#weather-code");
const forecastPrecipChance = document.querySelector("#forecast-precip-chance");
const forecastWeatherHeader = document.querySelector("#forecast-weather-head");
const betweenForecastHR = document.createElement("hr");
const flatIconAtt = document.querySelector(".attribution");
const climacellIcon = document.querySelector(".climacell-attribute");
const currentLeftDIv = document.querySelector(".current-left-div");
const currentRightDiv = document.querySelector(".current-right-div");
const hourlyTabButton = document.querySelector('#hourly-tab-button');
const dailyTabButton = document.querySelector('#daily-tab-button');
let firstSearch = true;
let hourListDiv = undefined;
flatIconAtt.style.visibility = "hidden";
climacellIcon.style.visibility = "hidden";
dailyTabButton.style.visibility = 'hidden';
hourlyTabButton.style.visibility = 'hidden';
forecastWeatherContent.style.visibility = 'hidden';
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

hourlyTabButton.addEventListener('click', function() {
  openPage('forecast-weather-content', this, 'lightblue')
})
dailyTabButton.addEventListener('click', function(){
  openPage('forecast-daily-content', this, 'darkblue')
})
// #endregion

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("running fetch");
  weatherContent.style.background = "inherit";
  const location = search.value;

  clearPreviousSearch();

  firstSearch = false;
  fetch(`/weather?address=${location}`).then((response) => {
    response.json().then((data) => {
      const { geocode, currentForecast, futureForecast, dailyForecast } = data;
      weatherContent.classList.add("weather-border");

      if (data.errorMsg) {
        weatherHead.textContent = "ERROR";
        currentTemp.textContent = `${data.errorMsg}`;
        currentTemp.classList.add("error");
      } else {
        displayCurrentWeather(geocode, currentForecast);
        displayForecastWeather(futureForecast);
        displayFiveDayWeather(dailyForecast);


        flatIconAtt.style.visibility = "visible";
        climacellIcon.style.visibility = "visible";
        weatherContent.style.background = "white";
        weatherHead.style.color = "black";
        forecastWeatherContent.style.visibility = 'visible';
        dailyTabButton.style.visibility = 'visible';
        hourlyTabButton.style.visibility = 'visible';
      }
    });
  });
});

/**
 * @memberof ClientSide
 * @description Capitalize the first word of a string.
 * @param {string} string String to capitalize first word.
 * @return {string} Capitalized string.
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @memberof ClientSide
 * @description Removes underscores and capitalizes first word of string.
 * @param {string} string String to normalize
 * @example "hot_and_sunny" becomes "Hot and sunny"
 * @return {string} Normalized and capitalized string.
 */
function normalizeString(string) {
  str = string.replace("_", " ");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @memberof ClientSide
 * @description Fills in HTML text content with weather data.
 * @param {object} geocode Object containing geocode data
 * @see {@link module:geocode} for how geocode data is obtained.
 * @param {object} currentForecast object containing current forecast data
 * @see {@link module:currentForecast} for how current forecast data is retrieved.
 */
function displayCurrentWeather(geocode, currentForecast) {
  weatherHead.textContent = `Your Current Weather for ${geocode.Location}`;

  const currentConditionIcon = createWeatherIcon(
    `/img/${currentForecast.weatherCode}.svg`,
    "75",
    "large-condition-icon",
    "conditions icon"
  );
  currentTemp.before(
    createWeatherIcon(
      "/img/temperature.svg",
      "50",
      "large-temp-icon",
      "temperature icon"
    )
  );
  const currentTempIcon = document.querySelector(".large-temp-icon");
  currentTempIcon.before(currentConditionIcon);

  currentTemp.textContent = `${Math.ceil(currentForecast.temp)}${
    currentForecast.units
  }`;

  weatherCode.textContent = `Conditions: ${normalizeString(
    currentForecast.weatherCode
  )}`;
  feelsLike.textContent = `Feels Like: ${Math.ceil(currentForecast.feelsLike)}${
    currentForecast.units
  }`;
  currentWinds.textContent = `Winds: ${
    currentForecast.cardinalWindHeading
  } at ${Math.ceil(currentForecast.windSpeed)} ${currentForecast.windUnits}`;
  humidity.textContent = `Humidity: ${currentForecast.humidity}%`;
  if (currentForecast.precipitationType != null) {
    precip.textContent = `Precipitation: ${capitalize(
      currentForecast.precipWord
    )} ${capitalize(currentForecast.precipitationType)} (${
      currentForecast.precipitation
    } ${currentForecast.precipitationUnits})`;
  } else {
    precip.textContent = `Precipitation: There is currently no precipitation`;
  }
}

/**
 * @memberof ClientSide
 * @description Fills in HTML text content with forecasted weather data.
 * @param {object} futureForecast object containing future forecast data
 * @see {@link module:futureForecast} for how current forecast data is retrieved.
 */
function displayForecastWeather(futureForecast) {
  forecastWeatherContent.insertBefore(betweenForecastHR, forecastWeatherHeader);
  hourListDiv = createForecastList(futureForecast);
  forecastPrecipChance.before(hourListDiv);

  if (futureForecast.rainChanceIn24Hours < 1) {
    forecastPrecipChance.textContent =
      "No rain is forecasted for the next 24 hours.";
  } else {
    forecastPrecipChance.textContent = `There is a ${futureForecast.rainChanceIn24Hours}% chance of rain in the next 24 hours.`;
  }
}

function displayFiveDayWeather(dailyForecast) {
  dailyList = createDailyList(dailyForecast);
  dailyForecastContent.appendChild(dailyList)
}

function createDailyList({dailyWeather: days}) {
  const dayList = createElementWithClass('div', 'daily-forecast-list')

  for (let day = 1; day < days.length; day++) {
    const dayData = days[day];
    const conditionIcon = createWeatherIcon(
      `/img/${days[day].weatherCode}.svg`,
      "60",
      "small-condition-icon",
      "condition icon"
    );
    const dayDiv = createElementWithClass('div', 'forecast-daily-div')
    const leftDiv = createElementWithClass('div', 'day-left-div');
    const rightDiv = createElementWithClass('div', 'day-right-div');
    const dateH4 = createElementWithClass('h4', 'forecast-day-date');

    rightDiv.appendChild(conditionIcon)

    dayDiv.appendChild(rightDiv)
    dayList.appendChild(dayDiv)
  }

  return dayList;
}


/**
 * @memberof ClientSide
 * @description Creates individual divs for each hour, and wraps it in a container div and returns it to be displayed.
 * @param {object} hourWeather The object containing an array of hours with associated
 * weather data for each hour.
 * @return {HTMLDivElement} The container DIV with all individual child divs for each hour.
 */
function createForecastList({ hourWeather: hours }) {
  let printedNewDay = false;
  let nightDay = "";
  const lineBreak = document.createElement("br");
  const tempImg = createWeatherIcon(
    "/img/temperature.svg",
    "25",
    "small-temp-icon",
    "temp gauge"
  );
  const rainDropImg = createWeatherIcon(
    "/img/drop.svg",
    "15",
    "small-precip-icon",
    "rain drop"
  );

  const hourList = document.createElement("div");
  hourList.className = "forecast-hourly-div";
  hourList.id = "hour-list";

  for (let hour = 1; hour < hours.length; hour++) {
    const hourData = hours[hour];
    const conditionIcon = createWeatherIcon(
      `/img/${hourData.weatherCode}.svg`,
      "60",
      "small-condition-icon",
      "condition icon"
    );
    const leftDiv = createElementWithClass("div", "hour-left-div");
    const rightDiv = createElementWithClass("div", "hour-right-div");
    const timeH4 = createElementWithClass("h4", "forecast-hour-time");
    const tempP = createElementWithClass("span", "forecast-hour-temp");
    const rainP = createElementWithClass("span", "forecast-hour-rain");
    if (hourData.dayNight == "day") {
      nightDay = "forecast-hour-div-day";
    } else {
      nightDay = "forecast-hour-div-night";
    }
    const hourDiv = createElementWithClass("div", `${nightDay}`);
    const conditionDiv = createElementWithClass("div", "small-condition-div");

    const time = readableFormatLocalTIme(hourData.time);
    const observationDate = new Date(hourData.time);
    const observationDay = observationDate.getDate();
    const currentDate = new Date();

    hourDiv.appendChild(timeH4);
    hourDiv.appendChild(leftDiv);
    hourDiv.appendChild(rightDiv);

    timeH4.appendChild(document.createTextNode(time));
    if (hour == 1) {
      const dateSpan = createElementWithClass("span", "date-span");
      const currentDay = currentDate.getDate();
      const currentMonth = month[currentDate.getMonth()];
      const currentYear = currentDate.getYear();
      const dateString = `${currentDay} ${currentMonth}`;
      dateSpan.appendChild(document.createTextNode(dateString));
      timeH4.appendChild(dateSpan);
    }
    if ((observationDay > currentDate.getDate()) & (printedNewDay == false)) {
      const dateSpan = createElementWithClass("span", "date-span");
      const nextDay = observationDay;
      const observedMonth = month[observationDate.getMonth()];
      const observedYear = observationDate.getYear();
      const dateString = `${nextDay} ${observedMonth}`;
      dateSpan.appendChild(document.createTextNode(dateString));
      timeH4.appendChild(dateSpan);
      printedNewDay = true;
    }

    tempP.appendChild(document.createTextNode(hourData.temp));
    rainP.appendChild(document.createTextNode(hourData.rainChanceAtHour));

    leftDiv.appendChild(tempImg.cloneNode(true));
    leftDiv.appendChild(tempP);
    leftDiv.appendChild(lineBreak.cloneNode(true));
    leftDiv.appendChild(rainDropImg.cloneNode(true));
    leftDiv.appendChild(rainP);

    rightDiv.appendChild(conditionDiv);
    conditionDiv.appendChild(conditionIcon);

    hourList.appendChild(hourDiv);
  }
  return hourList;
}


/**
 *@memberof ClientSide
 * @description Creates an image element with desired icon and it's dimensions ().
 * @param {string} src icon src
 * @param {string} dimensions desired width
 * @param {string} alt alt text for image
 * @return {HTMLImageElement} Request image
 */
function createWeatherIcon(src, dimensions, CSSclass, alt) {
  const Img = document.createElement("img");
  Img.setAttribute("src", src);
  Img.setAttribute("width", dimensions);
  Img.setAttribute("height", dimensions);
  Img.setAttribute("alt", alt);
  Img.className = CSSclass;

  return Img;
}

/**
 * @memberof ClientSide
 * @description Removes all child nodes of the forecast weather div, and then removes the parent.
 * Ran each time new search is requested.
 * @param {string} parent Parent of children to remove from DOM
 *
 */
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/**
 * @memberof ClientSide
 * @description Clears all stale weather data from webpage when new search is performed.
 */
function clearPreviousSearch() {
  if (weatherHead.textContent != "ERROR") {
    weatherHead.textContent = "Loading Weather";
    weatherHead.style.color = "white";
    currentTemp.textContent = "";
    currentWinds.textContent = "";
    precip.textContent = "";
    feelsLike.textContent = "";
    humidity.textContent = "";
    weatherCode.textContent = "";
    forecastPrecipChance.textContent = "";
    betweenForecastHR.remove();
    climacellIcon.style.visibility = "hidden";
    flatIconAtt.style.visibility = "hidden";

    if (firstSearch == false) {
      removeAllChildNodes(hourListDiv);
      hourListDiv.remove();
      const conditionIcon = document.querySelector(".large-condition-icon");
      const largeTempIcon = document.querySelector(".large-temp-icon");
      conditionIcon.remove();
      largeTempIcon.remove();
    }
  } else {
    weatherHead.textContent = "Loading Weather";
    currentTemp.textContent = "";
    currentTemp.classList.remove("error");
  }
}

/**
 *
 * @param {string} type the type of HTML Element to create
 * @param {string} className a class you want to add.
 */
function createElementWithClass(type, className) {
  const element = document.createElement(type);
  element.className = className;
  return element;
}

function readableFormatLocalTIme(dateTime) {
  const dateTimeLocal = new Date(dateTime);
  let ampm = "am";
  let hours = dateTimeLocal.getHours();
  if (hours > 12) {
    hours -= 12;
    ampm = "pm";
  }
  if (hours == 0) {
    hours = 12;
    ampm = "am";
  }
  returnHour = `${hours} ${ampm}`;

  return returnHour;
}

function openPage(pageName, elmnt, color) {

  // Hide all elements with class="tabcontent" by default */
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";

  }

  // Remove the background color of all tablinks/buttons
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = ''
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = "block";
  console.log(pageName)

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = color;
  elmnt.style.color = 'black'
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("hourly-tab-button").click();