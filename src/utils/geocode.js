/**
 * @module geocode
 */
const request = require("postman-request");

/**
 *
 * @param {string} mapbox_api Mapbox API Key
 * @param {string} address Address to turn into Lat and Lon
 * @param {callback} callback Callback function
 */
const geocode = (mapboxAPIToken, address) => {
  console.log('fetching geocode')
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?&access_token=${mapboxAPIToken}`;
  return new Promise((resolve, reject) => {
    request({ url: url, json: true }, (error, response, { message: messageError, features = [] } = {}) => {
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
        console.log(messageError)
        msgError =
          "GEOCODE API: Invalid Address. Address formats should include at least the city and state for best accuracy. Such as New York NY.";
        reject({status: 400, error: msgError});
      } else {
        const coordinates = {
          latitude: features[0].center[1],
          longitude: features[0].center[0],
          location: features[0].place_name,
        };
        resolve(coordinates);
      }
    });
  });
};
module.exports = geocode;
