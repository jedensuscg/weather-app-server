const request = require('postman-request')
const windDegToCardinal = require('./windDegToCardinal');
const precipWords = require('./precipWords')

const currentForecast = (lat, lon, callback) => {
    const urlCurrent = `https://api.climacell.co/v3/weather/realtime?unit_system=us&apikey=Mj8MQkOElh4cIm69zHBP5CjOyvYBP3cu&lat=${lat}&lon=${lon}&fields=wind_speed,temp,wind_direction,feels_like,humidity,precipitation,precipitation_type,weather_code`
    request({ url: urlCurrent, json: true }, (error, response, { errorCode, message: msgError, temp, wind_speed, wind_direction, feels_like, humidity, precipitation, precipitation_type, weather_code } = {}) => {
        if (error) {
            callback('Could not connect to Climacell API when attemping to retrieve current data. Check internet or verify URL.')
        } else if (errorCode) {
            callback(`Error Code: ${errorCode}`)
            callback(`Error Msg: ${msgError}`)
        } else if (msgError) {
            callback(`ERROR when attempting to retrieve current data! ${msgError}`)
        } else {

            const cardinalWindHeading = windDegToCardinal(wind_direction.value)
            const precipWord = precipWords(precipitation.value)
            console.log(precipitation_type.value)

            const data = {
                temp: temp.value,
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
            }
            callback(undefined, data)
        }
    })
}

module.exports = currentForecast