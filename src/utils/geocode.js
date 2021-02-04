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
const geocode = (mapbox_api, address) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?&access_token=${mapbox_api}`;
  return new Promise((resolve, reject) => {
    request({ url: url, json: true }, (error, response, { message: messageError, features = [] } = {}) => {
      if (error) {
        reject(`Unable to Connect to mapbox geocode service. Check internet connection or verify API URL`, error);
      } else if (messageError == "Not Found") {
        reject("Location Not Found");
      } else if (messageError == "GEOCODE API: Not Authorized - Invalid Token") {
        reject(messageError);
      } else if (features.length < 1 || features == undefined) {
        messageError =
          "GEOCODE API: Invalid Address. Address formats should include at least the city and state for best accuracy. Such as New York NY.";
        reject(messageError);
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
