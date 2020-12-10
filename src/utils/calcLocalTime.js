const printLocalTime = (dateTime) => {
    const dateTimeLocal = new Date(dateTime)
    const datTimeLocalHours = dateTimeLocal.toString().split(" ")[4]
    return datTimeLocalHours;

}

module.exports = printLocalTime