const request = require('postman-request')



const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?country=us&access_token=pk.eyJ1IjoiamVkZW5zdXNjZyIsImEiOiJja2h0ZmRnaWgwajVvMnltYWZvZnYydjRsIn0.KXbuLC-Z6UvR8R0nm7vUEg`

    request({ url: url, json: true }, (error, response, { message: messageError, features = [] } = {}) => {
        if (error) {
            callback(`Unable to Connect to mapbox geocode service. Check internet connection or verify API URL`, undefined)
        } else if (messageError == 'Not Found') {
            callback('Location Not Found', undefined)
        } else if (messageError == "Not Authorized - Invalid Token") {
            callback(messageError, undefined)
        } else if (features.length < 1 || features == undefined) {
            callback('No Center Point Found, please check address')
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