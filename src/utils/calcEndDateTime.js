const calcEndDateTime = (hours) => {
    const timeZoneOffsetHours = new Date().getTimezoneOffset() / 60;
    const currentDateTimeUTC = new Date(Date.now());

    
    const endDateTimeUTC = new Date();
    
    endDateTimeUTC.setHours(endDateTimeUTC.getHours() + hours)

    const endDateTimeUTCISO = endDateTimeUTC.toISOString()
    console.log(endDateTimeUTCISO);
    console.log({currentDateTimeUTC, endDateTimeUTC, endDateTimeUTCISO})
    return endDateTimeUTCISO
}

module.exports = calcEndDateTime