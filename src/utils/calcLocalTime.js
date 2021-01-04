const printLocalTime = (dateTime) => {
    const dateTimeLocal = new Date(dateTime)
    const dateTimeLocalHours = dateTimeLocal.toString().split(" ")[4]
    return dateTimeLocalHours;

}

const readableFormatLocalTIme = (dateTime) => {
    const dateTimeLocal = new Date(dateTime)
    let ampm = "am";
    let hours = dateTimeLocal.getHours();
    if(hours > 12) {
        hours -= 12;
        ampm = "pm"

    }
    if (hours == 0) {
        hours = 12;
        ampm = "am";
    }
    returnHour = `${hours} ${ampm}`
    return returnHour;

}

module.exports = {printLocalTime, readableFormatLocalTIme}