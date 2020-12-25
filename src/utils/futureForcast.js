const request = require('postman-request')
let rainChanceArray = [];


const futureForecast = (climacell_api, lat, lon, endTime, requestedTimeIndex, callback) => {
    const urlCurrent = `https://api.climacell.co/v3/weather/forecast/hourly?lat=${lat}&lon=${lon}&unit_system=us&start_time=now&end_time=${endTime}&fields=temp,precipitation_probability&apikey=${climacell_api}`
    request({ url: urlCurrent, json: true }, (error, { body }) => {
        if (error) {
            callback('Could not connect to Climacell API when attemping to retrieve forecast data. Check internet or verify URL.')
        } else if (body.errorCode) {
            callback(`Climacell Error Code: ${body.errorCode}: Error Msg: ${body.message}`)
        } else if (body.message) {
            callback(`Climacell: ERROR when attempting to retrieve forecast data! "${body.message}"`)
        } else if (!Number.isInteger(requestedTimeIndex)) {
            callback('Climacell: ERROR: Invalid quary parameter entered for TIME parameter. But be an integer.')
        } else {
            //Get array of rain chances
            for (let index = 0; index < body.length; index++) {
                rainChanceArray.push(body[index].precipitation_probability.value)
            }
            //Get highest chance of rain during time period
            console.log(body.observation_time.value);
            const observationTime = body[requestedTimeIndex].observation_time.value
            const rainChance = body[requestedTimeIndex].precipitation_probability.value
            const rainChanceIn24Hours = Math.max(...rainChanceArray);
            const data = {
                rainChanceArray: rainChanceArray,
                rainChance: rainChance,
                rainChanceIn24Hours,
                observationTime: observationTime,
                temp: body[requestedTimeIndex].temp.value,
                units: body[requestedTimeIndex].temp.units
            }
            callback(undefined, data)
        }
    })
}

module.exports = futureForecast