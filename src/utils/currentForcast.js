const request = require('postman-request')


const currentForecast = (lat, lon, callback) => {
    const urlCurrent = `https://api.climacell.co/v3/weather/realtime?unit_system=us&apikey=Mj8MQkOElh4cIm69zHBP5CjOyvYBP3cu&lat=${lat}&lon=${lon}&fields=wind_speed,temp`
    request({ url: urlCurrent, json: true }, (error, response, { errorCode, message: msgError, temp, wind_speed: wind } = {}) => {
        if (error) {
            callback('Could not connect to Climacell API when attemping to retrieve current data. Check internet or verify URL.')
        } else if (errorCode) {
            callback(`Error Code: ${errorCode}`)
            callback(`Error Msg: ${msgError}`)
        } else if (msgError) {
            callback(`ERROR when attempting to retrieve current data! ${msgError}`)
        } else {
            const data = {
                temp: temp.value,
                units: temp.units,
                wind: wind.value,
                windUnits: wind.units
            }
            callback(undefined, data)
        }
    })
}

module.exports = currentForecast