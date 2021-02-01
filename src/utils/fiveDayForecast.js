/**
 * @description Gets 5 day forecast from Climacell using specified query string.
 * @module futureForecast
 */

const request = require('postman-request');

/**
 *
 * @param {string} climacellAPI API Key for Climacell
 * @param {string} lat latitude
 * @param {string} lon longitude
 * @param {string} queryString The combined query fields to send to Climacell
 * @param {string} endTime end time to use for forecast
 * @param {callback} callback Callback
 */
const fiveDayForecast = (climacellAPI, lat, lon, queryString, endTime, callback) => {
  console.log('running 5 day');
  // eslint-disable-next-line max-len
  const urlCurrent = `https://api.climacell.co/v3/weather/forecast/daily?lat=${lat}&lon=${lon}&unit_system=us&start_time=now&end_time=${endTime}&fields=${queryString}&apikey=${climacellAPI}`;
  request({url: urlCurrent, json: true}, (error, {body}) => {
    if (error) {
      callback(
          'Could not connect to Climacell API when attempting to retrieve forecast data. Check internet or verify URL.',
      );
    } else if (body.errorCode) {
      callback(`Climacell Error Code: ${body.errorCode}: Error Msg: ${body.message}`);
    } else if (body.message) {
      callback(`Climacell: ERROR when attempting to retrieve forecast data! "${body.message}"`);
    } else {
      const tempUnit = body[0].temp[0].min.units;
      console.log(tempUnit);
      const dailyWeather = [];

      for (let index = 0; index < body.length; index++) {
        const observationDate = new Date(body[index].observation_time.value);

        const minTemp = body[0].temp[0].min.value;
        const maxTemp = body[0].temp[1].max.value;

        dailyWeather.push({
          time: body[index].observation_time.value,
          minTemp: `${Math.ceil(minTemp)}${tempUnit}`,
          maxTemp: `${Math.ceil(maxTemp)}${tempUnit}`,
          sunrise: body[index].sunrise.value,
          sunset: body[index].sunset.value,
          rainChance: `${body[index].precipitation_probability.value}%`,
          weatherCode: body[index].weather_code.value,
          observationDate,
        });
      }
      const data = {
        dailyWeather,
      };
      callback(undefined, data);
    }
  });
};

module.exports = fiveDayForecast;
