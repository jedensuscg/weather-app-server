const path = require('path')
const express = require('express')
const hbs = require('hbs')
const port = 3000

const app = express()

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialspath = path.join(__dirname, '../templates/partials')

// Setup handlebars egine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialspath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
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
    res.send({
        forcast: "65F",
        location: "Elizabeth City",
        name: 'James'
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