/**
 * @description Gets current forecast from Climacell using specified query string.
 * @module currentForecast
 */

/**
  * @description Returns a string descriptor of rainfall amounts based on inch per hour input.
  * @example Rainfall of .82 inch/hour would return the string 'Heavy'
  * @param {int} amount the rainfall amount as an integer
  * @return {string} The text description of rainfall amount.
  */
const precipWords = (amount) => {
  if (amount < 0.098) {
    return 'Light';
  } else if (amount > 0.098 && amount <= 0.30) {
    return 'Moderate';
  } else if (amount > 0.30 && amount <= 1.99) {
    return 'Heavy';
  } else if (amount > 1.99) {
    return 'Violent';
  }
};

module.exports = precipWords;
