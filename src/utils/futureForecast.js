/**
 * @description Gets future forecast from Climacell using specified query string.
 * @module futureForecast
 */

const request = require("postman-request");
const { query } = require("express");
let rainChanceArray = [];

/**
 *
 * @param {string} climacellAPIKey API Key for Climacell
 * @param {string} lat latitude
 * @param {string} lon longitude
 * @param {string} endTime end time to use for forecast
 * @param {string} requestedTimeIndex No longer used. leave blank
 * @param {callback} callback Callback
 */
const futureForecast = (climacellAPIKey, lat, lon, queryString, endTime) => {
  const urlCurrent = `https://api.climacell.co/v3/weather/forecast/hourly?apikey=${climacellAPIKey}&lat=${lat}&lon=${lon}&unit_system=us&start_time=now&end_time=${endTime}&fields=${queryString}`;
  return new Promise((resolve, reject) => {
    request({ url: urlCurrent, json: true }, (error, { body }) => {
      if (error) {
        reject({
          status: 404,
          error: "Could not connect to Climacell API when attempting to retrieve forecast data or verify Climacell service is available.",
        });
      } else if (body.errorCode) {
        reject({status: 401, error: `Climacell Error Code: ${body.errorCode}: Error Msg: ${body.message}`});
      } else if (body.message == "You cannot consume this service") {
        reject({ status: 403, error: `Climacell: ERROR when attempting to retrieve current data! ${body.message}.` });
      }
      else if (body.message) {
        reject({status: 400, error: `Climacell: ERROR when attempting to retrieve forecast data! "${body.message}"`});
      } else {
        const tempUnit = body[0].temp.units;
        let hourWeather = [];
        let weather = "";
        let dayNight = ";";
        for (let index = 0; index < body.length; index++) {
          rainChanceArray.push(body[index].precipitation_probability.value);
          const observationDate = new Date(body[index].observation_time.value);
          const sunrise = new Date(body[index].sunrise.value);
          const sunset = new Date(body[index].sunset.value);

          if (observationDate >= sunrise && observationDate < sunset) {
            dayNight = "day";
          } else {
            dayNight = "night";
          }

          if (
            body[index].weather_code.value == "clear" ||
            body[index].weather_code.value == "partly_cloudy" ||
            body[index].weather_code.value == "mostly_clear"
          ) {
            if (dayNight == "day") {
              weather = body[index].weather_code.value + "_day";
            } else {
              weather = body[index].weather_code.value + "_night";
            }
          } else {
            weather = body[index].weather_code.value;
          }
          hourWeather.push({
            time: body[index].observation_time.value,
            temp: `${Math.ceil(body[index].temp.value)}${tempUnit}`,
            sunrise: body[index].sunrise.value,
            sunset: body[index].sunset.value,
            rainChanceAtHour: `${body[index].precipitation_probability.value}%`,
            weatherCode: weather,
            dayNight,
          });
        }
        //Get highest chance of rain during time period
        const rainChanceIn24Hours = Math.max(...rainChanceArray);
        const data = {
          hourWeather,
          rainChanceIn24Hours,
          tempUnit,
        };
        resolve(data);
      }
    });
  });
};

module.exports = futureForecast;
