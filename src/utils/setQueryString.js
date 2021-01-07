/**
 * 
 * @module setQueryString 
 * @description Sets query string based on array of field strings. Replaces spaces with underscores.
 */

/**
 * @description Sets query string based on array of field strings. Replaces spaces with underscores.
 * @example ["temperature", "wind speed", feels_like"] will output "temperature,wind_speed,feels_like"
 * @param {string[]} fields Array of strings associated with weather data fields. All spaces are automatically replaced with underscore to
 * conform with Climacell API.
 * @see See Climacell API Docs for allowable fields. {@link https://developer.climacell.co/v3/reference#data-layers-core} 
 */
function setQueryString(fields = []) {
    const queryString = [];
    fields.forEach(element => {
        newElement = element.split(' ').join('_');
        queryString.push(newElement);

    });
    return queryString.join()

}

module.exports = setQueryString;