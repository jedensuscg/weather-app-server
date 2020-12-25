const request = require('postman-request')



const geocode = (mapbox_api, address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?&access_token=${mapbox_api}`

    request({ url: url, json: true }, (error, response, { message: messageError, features = [] } = {}) => {
        if (error) {
            callback(`Unable to Connect to mapbox geocode service. Check internet connection or verify API URL`, undefined)
        } else if (messageError == 'Not Found') {
            callback('Location Not Found', undefined)
        } else if (messageError == "GEOCODE API: Not Authorized - Invalid Token") {
            callback(messageError, undefined)
        } else if (features.length < 1 || features == undefined) {
            messageError = "GEOCODE API: Invalid Address. Address formats should include at least the city and state for best accuracy. Such as New York NY."
            callback(messageError, undefined)
        } else {
            const coordinates = {
                latitude: features[0].center[1],
                longitude: features[0].center[0],
                location: features[0].place_name
            }
            callback(undefined, coordinates)
        }
    })
}

module.exports = geocode