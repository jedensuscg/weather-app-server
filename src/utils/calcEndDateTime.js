const calcEndDateTime = (hours) => {
    const timeZoneOffsetHours = new Date().getTimezoneOffset() / 60;
    const currentDateTimeUTC = new Date(Date.now());
    const currentDateTimeLocal = new Date(currentDateTimeUTC.setHours(currentDateTimeUTC.getHours() - timeZoneOffsetHours));
    const endDateTimeUTC = currentDateTimeUTC;
    endDateTimeUTC.setHours(endDateTimeUTC.getHours() + hours)
    const endDateTimeUTCISO = endDateTimeUTC.toISOString()
    console.log(endDateTimeUTCISO);
    return endDateTimeUTCISO
}

module.exports = calcEndDateTime