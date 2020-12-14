const path = require('path')
const express = require('express')
const hbs = require('hbs')
const request = require('postman-request')
const calcLocalTime = require('./utils/calcLocalTime')
const geocode = require('./utils/geocode')
const currentForecast = require('./utils/currentForcast')
const futureForecast = require('./utils/futureForcast')
const calcEndDateTime = require('./utils/calcEndDateTime')
const { query } = require('express')
const port = 3000
let errorMsg = undefined

const app = express()
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
        msg: 'You can do stuff like this',
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
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
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
            currentForecast(latitude, longitude, (error, { temp: currentTemp, units, wind, windUnits } = {}) => {
                if (error) {
                    errorMsg = error
                    return
                } else {
                    const currentData = {
                        temp: currentTemp,
                        units: units,
                        wind: wind,
                        windUnits: windUnits
                    }
                    futureForecast(latitude, longitude, calcEndDateTime(24), requestedTimeIndex, (error, { temp: forcastTemp, rainChance, observationTime, rainChanceArray } = {}) => {
                        if (error) {
                            if (errorMsg === undefined) {
                                errorMsg = error
                            }
                            return res.send({
                                errorMsg
                            })
                        } else {
                            const rainIn24Hours = isFinite(Math.max(...rainChanceArray))
                            const observationTimeLocal = calcLocalTime(observationTime)
                            const hoursFromNow = requestedTimeIndex - 1
                            const forecastData = {
                                hoursFromNow,
                                observationTimeLocal,
                                rainChance,
                                forcastTemp,
                                units,
                                rainIn24Hours: rainIn24Hours
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


app.listen(port, () => console.log(`Example app listening on port ${port}!`))