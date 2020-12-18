const request = require('postman-request')
let rainChanceArray = [];


const futureForecast = (lat, lon, endTime, requestedTimeIndex, callback) => {
    const urlCurrent = `https://api.climacell.co/v3/weather/forecast/hourly?lat=${lat}&lon=${lon}&unit_system=us&start_time=now&end_time=${endTime}&fields=temp,precipitation_probability&apikey=Mj8MQkOElh4cIm69zHBP5CjOyvYBP3cu`
    request({ url: urlCurrent, json: true }, (error, { body }) => {
        if (error) {
            callback('Could not connect to Climacell API when attemping to retrieve forecast data. Check internet or verify URL.')
        } else if (body.errorCode) {
            callback(`Error Code: ${body.errorCode}`)
            callback(`Error Msg: ${body.message}`)
        } else if (body.message) {
            console.log(`ERROR when attempting to retrieve forecast data! "${body.message}"`)
        } else if (!Number.isInteger(requestedTimeIndex)) {
            callback('ERROR: Invalid quary parameter entered for TIME parameter. But be an integer.')
        } else {
            //Get array of rain chances
            for (let index = 0; index < body.length; index++) {
                rainChanceArray.push(body[index].precipitation_probability.value)
            }
            //Get highest chance of rain during time period
            const observationTime = body[requestedTimeIndex].observation_time.value
            console.log(body[requestedTimeIndex].observation_time.value)
            const rainChance = body[requestedTimeIndex].precipitation_probability.value
            const rainChanceIn24Hours = Math.max(...rainChanceArray);
            console.log(rainChanceIn24Hours)
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