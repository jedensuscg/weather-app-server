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

const weatherContentDiv = document.querySelector("#weather-content");
const forecastWeatherContentDiv = document.querySelector("#forecast-weather-content");
const dailyForecastContentDiv = document.querySelector("#forecast-daily-content");
const weatherForm = document.querySelector("form");
const searchInput = document.querySelector("input");
const weatherHeaderP = document.querySelector("#weather-head");
const currentTemp = document.querySelector("#current-temp");
const feelsLike = document.querySelector("#feels-like");
const currentWinds = document.querySelector("#current-winds");
const currentPrecipitation = document.querySelector("#precip");
const currentHumidity = document.querySelector("#humidity");
const weatherCode = document.querySelector("#weather-code");
const forecastPrecipChance = document.querySelector("#forecast-precip-chance");
const forecastWeatherHeader = document.querySelector("#forecast-weather-head");
const betweenForecastHR = document.createElement("hr");
const flatIconAttributeImg = document.querySelector(".attribution");
const climacellIcon = document.querySelector(".climacell-attribute");
const currentForecastLeftDIv = document.querySelector(".current-left-div");
const currentForecastRightDiv = document.querySelector(".current-right-div");
const hourlyTabButton = document.querySelector("#hourly-tab-button");
const dailyTabButton = document.querySelector("#daily-tab-button");
let firstSearch = true;
let hourListDiv = undefined;
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentYear = new Date().getFullYear();

flatIconAttributeImg.style.visibility = "hidden";
climacellIcon.style.visibility = "hidden";
dailyTabButton.style.visibility = "hidden";
hourlyTabButton.style.visibility = "hidden";
forecastWeatherContentDiv.style.visibility = "hidden";

hourlyTabButton.addEventListener("click", function () {
  openPage("forecast-weather-content", this, "lightblue");
});
dailyTabButton.addEventListener("click", function () {
  openPage("forecast-daily-content", this, "lightblue");
});
// #endregion

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();

  weatherContentDiv.style.background = "inherit";
  const location = searchInput.value;

    clearPreviousSearch();

 
  firstSearch = false;
  console.log("running fetch");
  fetch(`/weather?address=${location}`).then((response) => {
    response.json().then((data) => {
      const { geocode, currentForecast, futureForecast, dailyForecast } = data;

      weatherContentDiv.classList.add("weather-border");

      if (data.error) {
        weatherHeaderP.textContent = `ERROR: Status Code ${data.status}`;
        currentTemp.textContent = `${data.error}`;
        currentTemp.classList.add("error");
        firstSearch = true
        
      } else {
        displayCurrentWeather(geocode, currentForecast);
        displayForecastWeather(futureForecast);
        displayFiveDayWeather(dailyForecast);

        flatIconAttributeImg.style.visibility = "visible";
        climacellIcon.style.visibility = "visible";
        weatherContentDiv.style.background = "white";
        weatherHeaderP.style.color = "black";
        forecastWeatherContentDiv.style.visibility = "visible";
        dailyTabButton.style.visibility = "visible";
        hourlyTabButton.style.visibility = "visible";
      }
    });
  });
});

/**
 * @memberof ClientSide
 * @description Fills in HTML text content with weather data.
 * @param {object} geocode Object containing geocode data
 * @see {@link module:geocode} for how geocode data is obtained.
 * @param {object} currentForecast object containing current forecast data
 * @see {@link module:currentForecast} for how current forecast data is retrieved.
 */
function displayCurrentWeather(geocode, currentForecast) {
  weatherHeaderP.textContent = `Your Current Weather for ${geocode.location}`;

  const currentConditionIcon = createWeatherIcon(
    `/img/${currentForecast.weatherCode}.svg`,
    "75",
    "large-condition-icon",
    "conditions icon"
  );
  currentTemp.before(createWeatherIcon("/img/temperature.svg", "50", "large-temp-icon", "temperature icon"));
  const currentTempIcon = document.querySelector(".large-temp-icon");
  currentTempIcon.before(currentConditionIcon);

  currentTemp.textContent = `${Math.ceil(currentForecast.currentTemp)}${currentForecast.units}`;

  weatherCode.textContent = `Conditions: ${capitalizeString(normalizeString(currentForecast.weatherCode))}`;
  feelsLike.textContent = `Feels Like: ${Math.ceil(currentForecast.feelsLike)}${currentForecast.units}`;
  currentWinds.textContent = `Winds: ${currentForecast.cardinalWindHeading} at ${Math.ceil(currentForecast.windSpeed)} ${
    currentForecast.windUnits
  }`;
  currentHumidity.textContent = `Humidity: ${currentForecast.humidity}%`;
  if (currentForecast.precipitationType != null) {
    currentPrecipitation.textContent = `Precipitation: ${capitalizeString(currentForecast.precipWord)} ${capitalizeString(
      currentForecast.precipitationType
    )} (${currentForecast.precipitation} ${currentForecast.precipitationUnits})`;
  } else {
    currentPrecipitation.textContent = `Precipitation: There is currently no precipitation`;
  }
}

/**
 * @memberof ClientSide
 * @description Fills in HTML text content with forecasted weather data.
 * @param {object} futureForecast object containing future forecast data
 * @see {@link module:futureForecast} for how current forecast data is retrieved.
 */
function displayForecastWeather(futureForecast) {
  forecastWeatherContentDiv.insertBefore(betweenForecastHR, forecastWeatherHeader);
  hourListDiv = createForecastList(futureForecast);
  forecastPrecipChance.before(hourListDiv);

  if (futureForecast.rainChanceIn24Hours < 1) {
    forecastPrecipChance.textContent = "No rain is forecasted for the next 24 hours.";
  } else {
    forecastPrecipChance.textContent = `There is a ${futureForecast.rainChanceIn24Hours}% chance of rain in the next 24 hours.`;
  }
}

function displayFiveDayWeather(dailyForecast) {
  dailyList = createDailyList(dailyForecast);
  dailyForecastContentDiv.appendChild(dailyList);
}

function createDailyList(days) {
  console.log(days);
  // Create the list of days (div) to hold weather information
  const dayList = createElementWithClass("div", "daily-forecast-list");
  let day = 0;

  // Find when the forecast date matches current local date, in case API returns previous dates due to UTC.
  // Sets day to equal this index.
  for (let index = 0; index < days.length; index++) {
    date = new Date(days[index].time);
    if (date.getDate() == new Date().getDate()) day = index;
  }

  // Iterates over each day and creates the associated weather code Icon (i.e rain, sunny, etc.)
  for (day; day < days.length; day++) {
    const dayData = days[day];
    const conditionIcon = createWeatherIcon(`/img/${dayData.weatherCode}.svg`, "80", "small-condition-icon", "condition icon");

    // Create rest of the HTML Elements

    const dayDiv = createElementWithClass("div", "forecast-daily-div");
    const leftDiv = createElementWithClass("div", "day-left-div");
    const rightDiv = createElementWithClass("div", "day-right-div");
    const dateH3 = createElementWithClass("h3", "forecast-day-date");
    const lowTempDiv = createElementWithClass("div", "daily-low-temp-div");
    const highTempDiv = createElementWithClass("div", "daily-high-temp-div");
    const rainChanceDiv = createElementWithClass("div", "daily-rain-chance-div");

    // FIll out Temps
    lowTempDiv.appendChild(document.createTextNode(`LOW: ${dayData.minTemp}`));
    highTempDiv.appendChild(document.createTextNode(`HIGH: ${dayData.maxTemp}`));

    //FIll out Rain Chance
    rainChanceDiv.appendChild(document.createTextNode(`Precipitation: ${dayData.rainChance}`));

    // Append Date Header
    dateH3.appendChild(document.createTextNode(getDayAndMonth(dayData.time)));
    dayDiv.appendChild(dateH3);

    // Append left Div
    leftDiv.appendChild(lowTempDiv);
    leftDiv.appendChild(highTempDiv);
    leftDiv.appendChild(rainChanceDiv);

    // Append right Div
    rightDiv.appendChild(conditionIcon);

    // Append everything to the day Div
    dayDiv.appendChild(leftDiv);
    dayDiv.appendChild(rightDiv);

    // Append to the list of days Div.
    dayList.appendChild(dayDiv);
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
  // Create the list of hours (Div) to display weather data.
  const hourList = createElementWithClass("div", "forecast-hourly-div");
  hourList.id = "hour-list";

  let printedNewDay = false;
  let nightOrDay = "";

  const lineBreak = document.createElement("br");

  // create Icons with desired dimensions
  const temperatureIcon = createWeatherIcon("/img/temperature.svg", "25", "small-temp-icon", "temp gauge");
  const raidDropIcon = createWeatherIcon("/img/drop.svg", "15", "small-precip-icon", "rain drop");

  // Iterate through each hour and create element and fill with data.
  for (let hour = 1; hour < hours.length; hour++) {
    const hourData = hours[hour];

    // Create weather icon for specified weather code (ie Sunny, rain, etc.)
    const conditionIcon = createWeatherIcon(`/img/${hourData.weatherCode}.svg`, "60", "small-condition-icon", "condition icon");

    // Create HTML Elements
    const leftDiv = createElementWithClass("div", "hour-left-div");
    const rightDiv = createElementWithClass("div", "hour-right-div");
    const timeH4 = createElementWithClass("h4", "forecast-hour-time");
    const tempP = createElementWithClass("span", "forecast-hour-temp");
    const rainP = createElementWithClass("span", "forecast-hour-rain");
    const hourDiv = createElementWithClass("div", `${assignDayOrNightClass(hourData, timeH4)}`);
    const conditionDiv = createElementWithClass("div", "small-condition-div");
    const dateSpan = createElementWithClass("span", "date-span");
    const time = readableFormatLocalTIme(hourData.time);
    const observationDate = new Date(hourData.time);
    const observationDay = observationDate.getDate();
    const currentDate = new Date();

    hourDiv.appendChild(timeH4);
    hourDiv.appendChild(leftDiv);
    hourDiv.appendChild(rightDiv);

    // Append TODAY to dateSpan first hour time, and TOMORROW to Midnight hour dateSpan
    timeH4.appendChild(document.createTextNode(time));
    if (hour == 1) {
      const dateString = `TODAY`;
      dateSpan.appendChild(document.createTextNode(dateString));
      dateSpan.style.color = "black";
    }
    if ((observationDay > currentDate.getDate()) & (printedNewDay == false)) {
      const dateString = `TOMORROW`;
      dateSpan.appendChild(document.createTextNode(dateString));
      printedNewDay = true;
    }

    // Append elements to DOM
    timeH4.appendChild(dateSpan);
    tempP.appendChild(document.createTextNode(hourData.temp));
    rainP.appendChild(document.createTextNode(hourData.rainChanceAtHour));
    leftDiv.appendChild(temperatureIcon.cloneNode(true));
    leftDiv.appendChild(tempP);
    leftDiv.appendChild(lineBreak.cloneNode(true));
    leftDiv.appendChild(raidDropIcon.cloneNode(true));
    leftDiv.appendChild(rainP);
    rightDiv.appendChild(conditionDiv);
    conditionDiv.appendChild(conditionIcon);

    // Append current hour to hourList
    hourList.appendChild(hourDiv);
  }
  return hourList;

  //Object Functions
  function assignDayOrNightClass(hourData, timeH4) {
    if (hourData.dayNight == "day") {
      nightOrDay = "forecast-hour-div-day";
    } else {
      nightOrDay = "forecast-hour-div-night";
      timeH4.style.color = "white";
    }
    return nightOrDay;
  }
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
 * Ran each time new searchInput is requested.
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
 * @description Clears all stale weather data from webpage when new searchInput is performed.
 */
function clearPreviousSearch() {
  if (weatherHeaderP.textContent != "ERROR") {
    weatherHeaderP.textContent = "Loading Weather";
    weatherHeaderP.style.color = "white";
    currentTemp.textContent = "";
    currentWinds.textContent = "";
    currentPrecipitation.textContent = "";
    feelsLike.textContent = "";
    currentHumidity.textContent = "";
    weatherCode.textContent = "";
    forecastPrecipChance.textContent = "";
    betweenForecastHR.remove();
    climacellIcon.style.visibility = "hidden";
    flatIconAttributeImg.style.visibility = "hidden";
    forecastWeatherContentDiv.style.visibility = "hidden";
    dailyTabButton.style.visibility = "hidden";
    hourlyTabButton.style.visibility = "hidden";

    if (firstSearch == false) {
      removeAllChildNodes(hourListDiv);
      hourListDiv.remove();
      const conditionIcon = document.querySelector(".large-condition-icon");
      const largeTempIcon = document.querySelector(".large-temp-icon");
      conditionIcon.remove();
      largeTempIcon.remove();
    }
  } else {
    weatherHeaderP.textContent = "Loading Weather";
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

function getDayAndMonth(dateTime) {
  const dateTimeLocal = new Date(dateTime);
  const currentDate = new Date();
  const nextYear = new Date().getFullYear() + 1;

  let returnString = "";

  if (
    dateTimeLocal.getDate() >= currentDate.getDate() ||
    dateTimeLocal.getMonth() > currentDate.getMonth() ||
    dateTimeLocal.getFullYear() == nextYear
  ) {
    if (dateTimeLocal.getDate() == currentDate.getDate()) {
      return "TODAY";
    } else {
      const newMonth = month[dateTimeLocal.getMonth()];
      const newWeekday = weekday[dateTimeLocal.getDay()];
      const newDate = dateTimeLocal.getDate();

      returnString = `${newWeekday}, ${newMonth} ${newDate}`;
      console.log(dateTimeLocal.getFullYear());
      if (dateTimeLocal.getFullYear() == nextYear) {
        returnString += ` ${nextYear}`;
      }

      return returnString;
    }
  }
}

/**
 * @memberof ClientSide
 * @description Capitalize the first word of a string.
 * @param {string} string String to capitalize first word.
 * @return {string} Capitalized string.
 */
function capitalizeString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @memberof ClientSide
 * @description Removes underscores from string.
 * @param {string} string String to normalize
 * @example "hot_and_sunny" becomes "Hot and sunny"
 * @return {string} Normalized and capitalized string.
 */
function normalizeString(string) {
  str = string.replace("_", " ");
  return str;
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
    tablinks[i].style.backgroundColor = "";
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = "block";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = color;
  elmnt.style.color = "black";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("hourly-tab-button").click();
