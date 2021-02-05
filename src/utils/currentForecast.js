/**
 * @description Gets current forecast from Climacell using specified query string.
 * @module currentForecast
 */
const request = require("postman-request");
const windDegToCardinal = require("./windDegToCardinal");
const precipWords = require("./precipWords");

/**
 *
 * @param {string} climacell_api API key for Climacell
 * @param {string} lat Latitude
 * @param {string} lon Longtitude
 * @param {string} queryString The query string to send for desired data from Climacell API.
 * @param {callback} callback The callback with requested weather data or error.
 */
const currentForecast = (climacellAPIKey, lat, lon, queryString) => {
  const urlCurrent = `https://api.climacell.co/v3/weather/realtime?unit_system=us&apikey=${climacellAPIKey}&lat=${lat}&lon=${lon}&fields=${queryString}`;
  return new Promise((resolve, reject) => {
    request(
      { url: urlCurrent, json: true },
      (
        error,
        response,
        {
          errorCode,
          message: msgError,
          temp,
          wind_speed,
          wind_direction,
          feels_like,
          humidity,
          precipitation,
          precipitation_type,
          weather_code,
          sunrise,
          sunset,
        } = {}
      ) => {
        if (error) {
          reject({
            status: 404,
            error: "Could not connect to Climacell API when attempting to retrieve current data. Check internet or verify Climacell service is available.",
          });
        } else if (errorCode) {
          reject({ status: 401, error: `Climacell: Error Code: ${errorCode}: Error Msg: ${msgError}` });
        } else if (msgError == "You cannot consume this service") {
          reject({ status: 403, error: `Climacell: ERROR when attempting to retrieve current data! ${msgError}.` });
        } else if (msgError) {
          reject({ status: 400, error: `Climacell: ERROR when attempting to retrieve current data! ${msgError}` });
        } else {
          const cardinalWindHeading = windDegToCardinal(wind_direction.value);
          const precipWord = precipWords(precipitation.value);
          const data = {
            currentTemp: temp.value,
            units: temp.units,
            windSpeed: wind_speed.value,
            windDirection: wind_direction.value,
            windUnits: wind_speed.units,
            precipitation: precipitation.value,
            precipitationUnits: precipitation.units,
            humidity: humidity.value,
            feelsLike: feels_like.value,
            cardinalWindHeading,
            precipWord,
            precipitationType: precipitation_type.value,
            weatherCode: weather_code.value,
            sunrise,
            sunset,
          };
          resolve(data);
        }
      }
    );
  });
};

module.exports = currentForecast;
