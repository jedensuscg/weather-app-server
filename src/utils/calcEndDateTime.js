/**
 * @description Gets current forecast from Climacell using 
 * specified query string.
 * @module currentForecast
 */

/**
 * @description Returns a dateTime string in ISO format that is x number of 
 * hours from current dateTime
 * @param {int} hours Number of hours from now to calculate for ending date and time.
 * @return {string} Calculated date and time.
 */
const addHours = (hours) => {
  const endDateTimeUTC = new Date();

  endDateTimeUTC.setHours(endDateTimeUTC.getHours() + hours);

  const endDateTimeUTCISO = endDateTimeUTC.toISOString();
  return endDateTimeUTCISO;
};

/**
 * @description Returns a dateTime string in ISO format that is x number of 
 * hours from current dateTime
 * @param {int} days Number of days from now to calculate for ending date and time.
 * @return {string} Calculated date and time.
 */
const addDays = (days) => {
  const endDateTimeUTC = new Date();

  endDateTimeUTC.setDate(endDateTimeUTC.getDate() + days);
  console.log('days')
  const endDateTimeUTCISO = endDateTimeUTC.toISOString();
  return endDateTimeUTCISO;
}

module.exports = {
  addDays,
  addHours,
}
