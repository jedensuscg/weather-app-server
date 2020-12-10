const dateUtil = (hours) => {
    const currentDateTimeZulu = new Date()
    const endDateTimeZulu = new Date()

    endDateTimeZulu.setHours(currentDateTimeZulu.getHours() + hours)
    const endDateTimeZuluISO = endDateTimeZulu.toISOString()

    return endDateTimeZuluISO
}

module.exports = dateUtil