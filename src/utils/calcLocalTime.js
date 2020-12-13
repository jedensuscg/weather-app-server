const printLocalTime = (dateTime) => {
    const dateTimeLocal = new Date(dateTime)
    const dateTimeLocalHours = dateTimeLocal.toString().split(" ")[4]
    return dateTimeLocalHours;

}

module.exports = printLocalTime