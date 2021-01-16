/**
 * @namespace BackEnd
 * @description Back-end Webserver and API.
 */

//  * Created by James Edens. Inspired by the Udemy course located at
//  * https://www.udemy.com/course/the-complete-nodejs-developer-course-2/
//  * Credit goes to Andrew Mead for the inspiration. Mead.io

const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const currentForecast = require("./utils/currentForecast");
const futureForecast = require("./utils/futureForecast");
const fiveDayForecast = require('./utils/fiveDayForecast')
const calcEndDateTime = require("./utils/calcEndDateTime");
const setQueryString = require("./utils/setQueryString");
require("dotenv").config();

// Dev Stuff
let testGeocode = null;
let testCurrentForecast = null;
let testFutureForecast = null;
let testDailyForecast = null;
if (process.env.NODE_ENV == "development") {
  const fs = require("fs");
  const rawData = fs.readFileSync("./devOps/testWeatherFull.json");
  const testData = JSON.parse(rawData);
  testGeocode = testData.geocode;
  testCurrentForecast = testData.currentForecast;
  testFutureForecast = testData.futureForecast;
  testDailyForecast = testData.dailyForecast;
}

/**
 * @memberof BackEnd
 * @description The array of requested weather data fields
 * @example For temperature, wind speed and humidity to be returned,
 * the array would be ["wind_speed","temp","wind_direction","humidity"]
 * @type {array}
 * @const
 *
 */
const currentForecastQueryFields = [
  "wind_speed",
  "temp",
  "wind_direction",
  "feels_like",
  "humidity",
  "precipitation",
  "precipitation_type",
  "weather_code",
  'sunrise',
  'sunset',
];
/**
 * @memberof BackEnd
 * @description The formatted query string that includes all fields desired to be retrieved from Climacell API and is attached to the URL.
 * @type {string}
 * @const
 */
const currentForecastQueryString = setQueryString(currentForecastQueryFields);
const forecastWeatherQueryFields = [
  "temp",
  "precipitation_probability",
  "weather_code",
  'sunrise',
  'sunset',
];
const forecastWeatherQueryString = setQueryString(forecastWeatherQueryFields);

const dailyForecastQueryFields = [
  "temp",
  "precipitation_probability",
  "weather_code",
  'sunrise',
  'sunset',
];
const dailyForecastQueryString = setQueryString(dailyForecastQueryFields);

let errorMsg = undefined;

const app = express();
const port = process.env.PORT || 3000;
const mapboxAPIKey = process.env.API_KEY_MAPBOX;
const climacellAPIKey = process.env.API_KEY_CLIMACELL;
let requestedTimeIndex = 13;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "WEATHER",
    name: "James Edens",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "ABOUT",
    name: "James Edens",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "HELP",
    name: "James Edens",
  });
});

if (process.env.NODE_ENV == "production") {
  console.log(`Sending data in ${process.env.NODE_ENV} mode.`);
  app.get("/weather", (req, res) => {
    if (!req.query.address) {
      return res.send({
        errorMsg: "Address must be provided",
      });
    }
    geocode(
      mapboxAPIKey,
      req.query.address,
      (error, { latitude, longitude, location } = {}) => {
        if (error) {
          errorMsg = error;
          return res.send({
            errorMsg,
          });
        } else {
          const geocodeData = {
            type: "Geocode",
            Latitude: latitude,
            Longitude: longitude,
            Location: location,
          };
          currentForecast(
            climacellAPIKey,
            latitude,
            longitude,
            currentForecastQueryString,
            (
              error,
              {
                temp: currentTemp,
                units,
                windSpeed,
                windUnits,
                windDirection,
                precipitation,
                precipitationUnits,
                humidity,
                feelsLike,
                cardinalWindHeading,
                precipitationType,
                precipWord,
                weatherCode,
              } = {}
            ) => {
              if (error) {
                errorMsg = error;
                return res.send({
                  errorMsg,
                });
              } else {
                const currentData = {
                  temp: currentTemp,
                  units,
                  windSpeed,
                  windUnits,
                  windDirection,
                  precipitation,
                  precipitationUnits,
                  humidity,
                  feelsLike,
                  cardinalWindHeading,
                  precipitationType,
                  precipWord,
                  weatherCode,
                };
                futureForecast(climacellAPIKey,latitude,longitude,forecastWeatherQueryString,calcEndDateTime.addHours(25),(error,{ hourWeather, rainChanceIn24Hours, tempUnit } = {}) => {
                    if (error) {
                      if (errorMsg === undefined) {
                        errorMsg = error;
                      }
                      return res.send({
                        errorMsg,
                      });
                    } else {
                      const forecastData = {
                        hourWeather,
                        rainChanceIn24Hours,
                        tempUnit,
                      };
                      fiveDayForecast(climacellAPIKey,latitude,longitude,dailyForecastQueryString,calcEndDateTime.addDays(6),(error,{ dailyWeather, tempUnit } = {}) => {
                        if (error) {

                          if (errorMsg === undefined) {
                            errorMsg = error;
                          }
                          return res.send({
                            errorMsg,
                          });
                        } else {
                          const dailyForecastData = {
                            dailyWeather,
                            tempUnit,
                          }
                          res.send({
                            geocode: geocodeData,
                            currentForecast: currentData,
                            futureForecast: forecastData,
                            dailyForecast: dailyForecastData,
                          });
                        }

                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
}

if (process.env.NODE_ENV == "development") {
  console.log(`sending data in ${process.env.NODE_ENV} mode.`);
  app.get("/weather", (req, res) => {
    res.send({
      geocode: testGeocode,
      currentForecast: testCurrentForecast,
      futureForecast: testFutureForecast,
      dailyForecast: testDailyForecast,
    });
  });
}

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    msg: "Help Article not found",
    name: "James Edens",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    msg: "Could not find the page you are looking for",
    name: "James Edens",
  });
});

app.listen(port, () => console.log(`Weather app listening on port ${port}!`));
