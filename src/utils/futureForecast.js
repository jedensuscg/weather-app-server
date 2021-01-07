/**
 * @description Gets future forecast from Climacell using specified query string.
 * @module futureForecast
 */

const calcLocalTime = require('./calcLocalTime')
const request = require('postman-request');
const { query } = require('express');
let rainChanceArray = [];



/**
 * 
 * @param {string} climacell_api API Key for Climacell
 * @param {string} lat latitude
 * @param {string} lon longitude
 * @param {string} endTime end time to use for forecast
 * @param {string} requestedTimeIndex No longer used. leave blank
 * @param {callback} callback Callback
 */
const futureForecast = (climacell_api, lat, lon, queryString, endTime, callback) => {
    const urlCurrent = `https://api.climacell.co/v3/weather/forecast/hourly?lat=${lat}&lon=${lon}&unit_system=us&start_time=now&end_time=${endTime}&fields=${queryString}&apikey=${climacell_api}`
    request({ url: urlCurrent, json: true }, (error, { body }) => {
        if (error) {
            callback('Could not connect to Climacell API when attemping to retrieve forecast data. Check internet or verify URL.')
        } else if (body.errorCode) {
            callback(`Climacell Error Code: ${body.errorCode}: Error Msg: ${body.message}`)
        } else if (body.message) {
            callback(`Climacell: ERROR when attempting to retrieve forecast data! "${body.message}"`)
        } else {
            const tempUnit = body[0].temp.units;
            let hourWeather = [];
            for (let index = 0; index < body.length; index++) {
                rainChanceArray.push(body[index].precipitation_probability.value)
                const time = calcLocalTime.readableFormatLocalTIme(body[index].observation_time.value)
                hourWeather.push({
                    time,
                    temp: `${Math.ceil(body[index].temp.value)}${tempUnit}`,
                    rainChanceAtHour: `${body[index].precipitation_probability.value}%`,
                    weatherCode : body[index].weather_code.value,
                })
            }

            
            //Get highest chance of rain during time period
            const rainChanceIn24Hours = Math.max(...rainChanceArray);
            const data = {
                hourWeather,
                rainChanceIn24Hours,
 
            }
            callback(undefined, data)
        }
    })
}

module.exports = futureForecast