/**
 * @module geocode
 */
const request = require("postman-request");
const validator = require('validator')

/**
 *
 * @param {string} mapbox_api Mapbox API Key
 * @param {string} address Address to turn into Lat and Lon
 * @param {callback} callback Callback function
 */
const geocode = (mapboxAPIToken, address) => {
  console.log(address)
  const url = () => {
    if (validator.isPostalCode(address, 'any')) {
      console.log("postcode")
      return `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapboxAPIToken}`;
    } else if(validator.isLatLong(address)) {
      console.log('LAT LONG')
      return `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapboxAPIToken}`;
    }
    else {
      console.log(address)
      return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?types=poi&access_token=${mapboxAPIToken}`;
    }
  }

  console.log('fetching geocode')
  
  return new Promise((resolve, reject) => {
    request({ url: url(), json: true }, (error, response, { message: messageError, features = [] } = {}) => {
      if (error) {
        reject({status: 404, error: `Unable to Connect to mapbox geocode service. Check internet connection or verify Mapbox service is available`});
      } else if (messageError == "Not Found") {
        reject({status: 400, error: "Location Not Found"});
      } else if (messageError == "Not Authorized - Invalid Token") {
        reject({status: 401, error: messageError});
      } else if(messageError == 'Not Authorized - No Token') {
        reject({status: 401, error: messageError});
      }
      else if (features.length < 1 || features == undefined) {
        msgError =
          "GEOCODE API: Invalid Address. Address formats should include at least the city and state for best accuracy. Such as New York NY.";
        reject({status: 400, error: msgError});
      } else {

        shortLocation = () => {
          let place = ""
          let region = ""
          const context = features[0].context;
          for (let prop in context) {
            const newContext = context[prop]
            if (newContext.id.includes('place')) {
              place = newContext.text
            }
            if (newContext.id.includes("region")) {
              region = newContext.text
            }
            if (newContext.id.includes("postcode")) {
              postcode = newContext.text
            } else {
              postcode = ''
            }
          }
          return `${place} ${region}, ${postcode}`
        }
        console.log(shortLocation())
        const coordinates = {
          latitude: features[0].center[1],
          longitude: features[0].center[0],
          // location: features[0].place_name,
          location: shortLocation(),
          text: "WORKED"

        };
        resolve(coordinates);
      }
    });
  });
};
module.exports = geocode;
