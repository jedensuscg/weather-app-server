const timeZoneOffsetHours = new Date().getTimezoneOffset() / 60;
const currentDateTimeUTC = new Date(Date.now());
const currentDateTimeLocal = new Date(currentDateTimeUTC.setHours(currentDateTimeUTC.getHours() - timeZoneOffsetHours));
const endDateTimeUTC = new Date()


const calcEndDateTime = (hours) => {
    endDateTimeUTC.setHours(endDateTimeUTC.getHours() + hours)
    const endDateTimeUTCISO = endDateTimeUTC.toISOString()
    return endDateTimeUTCISO
}

module.exports = calcEndDateTime