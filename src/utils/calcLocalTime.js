/**
 * Calculate Local TIme Module
 * @module calcLocalTime 
 */
const { DateTime } = require("luxon");
/**
 * Convert full Date object to local hours in 24 hour format.
 * @param {Date} dateTime Date object to convert to local hours.
 */
const printLocalTime = (dateTime) => {
    const dateTimeLocal = new Date(dateTime)
    const dateTimeLocalHours = dateTimeLocal.toString().split(" ")[4]
    return dateTimeLocalHours;

}

/**
 * Convert full Date object to local hours in 12 format with am pm appended.
 * @param {Date} dateTime Date object to convert
 */
const readableFormatLocalTIme = (dateTime) => {
    const dateTimeLocal = new Date(dateTime)
    console.log(dateTimeLocal)
    dateTimeLocal.setUTCHours(dateTimeLocal.getUTCHours() - timezoneOffset)
    console.log(dateTimeLocal)
    let ampm = "am";
    let hours = dateTimeLocal.
    console.log(hours)
    if(hours > 12) {
        hours -= 12;
        ampm = "pm"

    }
    if (hours == 0) {
        hours = 12;
        ampm = "am";
    }
    returnHour = `${hours} ${ampm}`
    console.log(returnHour)
 
    return returnHour;

}

module.exports = {printLocalTime, readableFormatLocalTIme}