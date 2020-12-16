const precipWords = (amount) => {
    if (amount < 0.098) {
        return "Light";
    } else if (amount > 0.098 && amount <= 0.30) {
        return "Moderate";
    } else if (amount > 56.25 && amount <= 78.75) {
        return "Heavy";
    } else if (amount > .50) {
        return "Violent";
    }
}

module.exports = precipWords