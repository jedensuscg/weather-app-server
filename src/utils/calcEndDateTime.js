/**
 * 
 * @param {int} hours Number of hours from now to calculate for ending date and time.
 */
const calcEndDateTime = (hours) => {
    const timeZoneOffsetHours = new Date().getTimezoneOffset() / 60;
    const currentDateTimeUTC = new Date(Date.now());

    
    const endDateTimeUTC = new Date();
    
    endDateTimeUTC.setHours(endDateTimeUTC.getHours() + hours)

    const endDateTimeUTCISO = endDateTimeUTC.toISOString()
    return endDateTimeUTCISO
}

module.exports = calcEndDateTime