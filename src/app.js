/**
 * Created by James Edens. Inspired by the Udemy course located at
 * https://www.udemy.com/course/the-complete-nodejs-developer-course-2/
 * Credit goes to Andrew Mead for the inspiration. Mead.io
 */
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const calcLocalTime = require('./utils/calcLocalTime')
const geocode = require('./utils/geocode')
const currentForecast = require('./utils/currentForcast')
const futureForecast = require('./utils/futureForcast')
const calcEndDateTime = require('./utils/calcEndDateTime')
require('dotenv').config();

//Dev Stuff
let testGeocode = null
let testCurrentForecast = null
let testFutureForecast = null
if (process.env.NODE_ENV == 'development') {
    const fs = require('fs')
    const rawData = fs.readFileSync('./devOps/testWeather.json')
    const testData = JSON.parse(rawData)
    testGeocode = testData.geocode
    testCurrentForecast = testData.currentForecast
    testFutureForecast = testData.futureForecast
}



let errorMsg = undefined

const app = express()
const port = process.env.PORT || 3000
const mapboxAPIKey = process.env.API_KEY_MAPBOX;
const climacellAPIKey = process.env.API_KEY_CLIMACELL;
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
        name: "James Edens",
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        name: 'James Edens'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        name: 'James Edens'
    })
})

if (process.env.NODE_ENV == 'production') {
    console.log(`Sending data in ${process.env.NODE_ENV} mode.`)
    app.get('/weather', (req, res) => {
        if (!req.query.address) {
            return res.send({
                errorMsg: 'Address must be provided'
            })
        }
        if (req.query.time) {
            requestedTimeIndex = parseInt(req.query.time)
        }
        geocode(mapboxAPIKey, req.query.address, (error, {
            latitude,
            longitude,
            location
        } = {}) => {
            if (error) {
                errorMsg = error
                return res.send({
                    errorMsg
                })
            } else {
                const geocodeData = {
                    type: "Geocode",
                    Latitude: latitude,
                    Longitude: longitude,
                    Location: location,
                }
                currentForecast(climacellAPIKey, latitude, longitude, (error, {
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
                    weatherCode
                } = {}) => {
                    if (error) {
                        errorMsg = error
                        return res.send({
                            errorMsg
                        })
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
                        futureForecast(climacellAPIKey, latitude, longitude, calcEndDateTime(25), requestedTimeIndex, (error, {
                            hourWeather,
                            rainChanceIn24Hours,
                            tempUnit,
                        } = {}) => {
                            if (error) {
                                if (errorMsg === undefined) {
                                    errorMsg = error
                                }
                                return res.send({
                                    errorMsg
                                })
                            } else {
                                // const newHoursFromNow = (() => {
                                //     const d1 = (Date.parse(observationTime))
                                //     const d2 = (Date.now())
                                //     let seconds = Math.floor((d1 - d2) / 1000);
                                //     let minutes = Math.floor(seconds / 60);
                                //     let hours = Math.floor(minutes / 60);
                                //     let days = Math.floor(hours / 24);
                                //     hours = hours - (days * 24);
                                //     minutes = minutes - (days * 24 * 60) - (hours * 60);
                                //     seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
                                //     return {
                                //         hours,
                                //         minutes,
                                //     }
                                // })();
                                const forecastData = {
                                    hourWeather,
                                    rainChanceIn24Hours,
                                    tempUnit,
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
}

if (process.env.NODE_ENV == 'development') {
    console.log(`Sendign data in ${process.env.NODE_ENV} mode.`)
    app.get('/weather', (req, res) => {
        res.send({
            geocode: testGeocode,
            currentForecast: testCurrentForecast,
            futureForecast: testFutureForecast
        })
    })
}

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: "404",
        msg: "Help Article not found",
        name: 'James Edens'
    })
})


app.get('*', (req, res) => {
    res.render('404', {
        title: "404",
        msg: "Could not find the page you are looking for",
        name: 'James Edens'
    })
})


app.listen(port, () => console.log(`Weather app listening on port ${port}!`))