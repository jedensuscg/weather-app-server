# Node.JS Weather App Webserver and front-end UI.

- [Node.JS Weather App Webserver and front-end UI.](#nodejs-weather-app-webserver-and-front-end-ui)
    - [ABOUT](#about)
    - [CURRENT FEATURES](#current-features)
    - [USAGE](#usage)
    - [UPCOMING FEATURES](#upcoming-features)

### ABOUT
Full application for the weather app course on udemy.com.
https://www.udemy.com/course/the-complete-nodejs-developer-course-2/

Extensive additions to the original course.
You can view the LIVE app at https://weather.jamesedens.me
NOTE* Live implementation running on Heroku free dynamo. Thus, if the app has no been used in 30 minutes it is unloaded and will take about 10-20 seconds for the server to boot up on Heroku's end. Please wait.

Back end webserver created in Node.JS and ExpressJS. MVC handled through handlebars. No frameworks used for front end implementation.

### CURRENT FEATURES
- Easy geocoding
    - Get location from a simple city name, all the way to a full address. The first address that the API returns is used, so state may be required. For example entering Redding returns Redding, California US. So if you need Redding, Indiana, type Redding IN
- Current Weather
  - current sky conditions
  - temperature in fahrenheit
  - feels like in fahrenheit
  - humidity
  - winds in cardinal directions
  - Precipitation in both plain text (light rain) and inches per hour.
- Forecast Weather
  - Gives chance of rain for the next 24 hours.
  - Select number of hours in the future you want to check and get:
    - forecasted temperature
    - rain chance

### USAGE
If you wish to use this and expand on it some key things to know are:
1) run npm install to download required npm packages

2) You will need to register for your own Climacell and Mapbox API keys/tokens.
No keys are included with for obvious reasons. Instead they are assigned at runtime via enviroment vars.

3) You will then need to reference your keys. The keys are referenced in 
src/app.js as:
```javascript
const mapbox_api = process.env.API_KEY_MAPBOX;
const climacell_api = process.env.API_KEY_CLIMACELL;
```

The easiest way to refer your keys is locally is to create a .env file in the root directory wit the keys inside
and use the dotenv (include with npm install) to attach them to process.env.  For online add your keys as an environment variable (as I did with Heroku).

If you would like to see the full JSON object that is returned on the custom endpoint use the following address
`https://weather.jamesedens.me/weather?address=<location>`
Where `<location>` is the city or address. For example `https://weather.jamesedens.me/weather?address=redding`.
Optionally you can append the query `time=<time>`, where time is the number of hours up to 24 you want to search for the forecast weather. `https://weather.jamesedens.me/weather?address=redding&time=12`. If no time query is used, the default of 8 hours is used.

Here is an example parsed JSON return

```json
{
"geocode": {
"type": "Geocode",
"Latitude": 40.5864,
"Longitude": -122.3917,
"Location": "Redding, California, United States"
},
"currentForecast": {
"temp": 40.55,
"units": "F",
"windSpeed": 8.39,
"windUnits": "mph",
"windDirection": 312.31,
"precipitation": 0,
"precipitationUnits": "in/hr",
"humidity": 64.44,
"feelsLike": 40.55,
"cardinalWindHeading": "NW",
"precipitationType": "none",
"precipWord": "Light",
"weatherCode": "clear"
},
"futureForecast": {
"hoursFromNow": 11,
"observationTimeLocal": "01:00",
"rainChance": 0,
"temp": 48.86,
"units": "F",
"rainChanceIn24Hours": 0,
"newHoursFromNow": {
"hours": 11,
"minutes": 12
        }
    }
}
```


### UPCOMING FEATURES
- Full 12 hours forecast for the current day.
- 5 day forcast for the week.