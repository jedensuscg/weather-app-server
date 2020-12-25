const path = require('path')
const express = require('express')
const hbs = require('hbs')
const calcLocalTime = require('./utils/calcLocalTime')
const geocode = require('./utils/geocode')
const currentForecast = require('./utils/currentForcast')
const futureForecast = require('./utils/futureForcast')
const calcEndDateTime = require('./utils/calcEndDateTime')
const { query } = require('express')
require('dotenv').config();

let errorMsg = undefined

const app = express()
const port = process.env.PORT || 3000
const mapbox_api = process.env.API_KEY_MAPBOX;
const climacell_api = process.env.API_KEY_CLIMACELL;
let requestedTimeIndex = 13

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialspath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialspath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))



app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: "James"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        name: 'James'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        name: 'James'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            errorMsg: 'Address must be provided'
        })
    }
    if (req.query.time) {
        requestedTimeIndex = parseInt(req.query.time) + 1
    }
    geocode(mapbox_api, req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            errorMsg = error
            return res.send({ errorMsg })
        } else {
            const geocodeData = {
                type: "Geocode",
                Latitude: latitude,
                Longitude: longitude,
                Location: location,
            }
            currentForecast(climacell_api, latitude, longitude, (error, { temp: currentTemp, units, windSpeed, windUnits, windDirection, precipitation, precipitationUnits, humidity, feelsLike, cardinalWindHeading, precipitationType, precipWord, weatherCode } = {}) => {
                if (error) {
                    errorMsg = error
                    return res.send({errorMsg})
                } else {
                    const currentData = {
                        temp: currentTemp,
                        units,
                        windSpeed,
                        windUnits,
                        windDirection,
                        precipitation,
                        precipitationUnits,
                        humidity,
                        feelsLike,
                        cardinalWindHeading,
                        precipitationType,
                        precipWord,
                        weatherCode,
                    }
                    futureForecast(climacell_api, latitude, longitude, calcEndDateTime(24), requestedTimeIndex, (error, { temp, rainChance, observationTime, rainChanceIn24Hours } = {}) => {
                        if (error) {
                            if (errorMsg === undefined) {
                                errorMsg = error
                            }
                            return res.send({
                                errorMsg
                            })
                        } else {
                            const observationTimeLocal = (() => {
                                let time = calcLocalTime(observationTime)
                                return time.substring(0, time.length - 3)
                            })();
                            const hoursFromNow = requestedTimeIndex - 1

                            const newHoursFromNow = (() => {
                                const d1 = (Date.parse(observationTime))
                                const d2 = (Date.now())
                                let seconds = Math.floor((d1 - d2) / 1000);
                                let minutes = Math.floor(seconds / 60);
                                let hours = Math.floor(minutes / 60);
                                let days = Math.floor(hours / 24);
                                hours = hours - (days * 24);
                                minutes = minutes - (days * 24 * 60) - (hours * 60);
                                seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
                                return {
                                    hours,
                                    minutes,
                                }
                            })();
                            const forecastData = {
                                hoursFromNow,
                                observationTimeLocal,
                                rainChance,
                                temp,
                                units,
                                rainChanceIn24Hours,
                                newHoursFromNow,
                            }
                            res.send({
                                geocode: geocodeData,
                                currentForecast: currentData,
                                futureForecast: forecastData
                            })
                        }

                    })
                }

            })
        }
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: "404",
        msg: "Help Article not found",
        name: 'James'
    })
})


app.get('*', (req, res) => {
    res.render('404', {
        title: "404",
        msg: "Could not find the page you are looking for",
        name: 'James'
    })
})


app.listen(port, () => console.log(`Weather app listening on port ${port}!`))