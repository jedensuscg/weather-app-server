# Node.JS Weather App Webserver and front-end UI.

View the app at [https://weather.jamesedens.me](https://weather.jamesedens.me)
(Give it 10-20 seconds. Its hosted on a free Heroku dyno and needs to "wake up
the server)

- [Node.JS Weather App Webserver and front-end UI.](#nodejs-weather-app-webserver-and-front-end-ui)
    - [ABOUT](#about)
    - [CURRENT FEATURES](#current-features)
    - [USAGE](#usage)
    - [UPCOMING FEATURES](#upcoming-features)

### ABOUT

This is a full application that is continuing the app created through a course on udemy.com.
[The complete nodejs developer course](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/)

Extensive additions made after the original course ended.

This is by NO means a "professional" product.

You can view the LIVE app at [https://weather.jamesedens.me](https://weather.jamesedens.me)
NOTE\* Live implementation running on Heroku free dynamo. Thus, if the app has no been used in 30 minutes it is unloaded and will take about 10-20 seconds for the server to boot up on Heroku's end. Please wait.

Back end webserver created in Node.JS and ExpressJS. Basic templates handled through handlebars. (Footer and header mostly).

### CURRENT FEATURES

- Easy geocoding
  - Get location from a simple city name, zipcode, or a full address.
  - Option to get location from browser.
- Current Weather
  - current sky conditions with icon
  - temperature in fahrenheit
  - feels like in fahrenheit
  - humidity
  - winds in cardinal directions
  - Precipitation in both plain text (light rain) and inches per hour.
- Forecast Weather
  - 24 hour forecast
    - temp and rain chance each hour
    - weather condition each hour with icon
  - Gives chance of rain for the next 24 hours.
- 5 Day Forecast
  - Shows current condition Icon
  - Shows Temperature

### USAGE

If you wish to use this and expand on it some key things to know are:

1. run npm install to download required npm packages

2. You will need to register for your own Climacell and Mapbox API keys/tokens.
   No keys are included for obvious reasons. Instead they are assigned at runtime via environment vars.

3. You will then need to reference your keys. The keys are referenced in
   src/app.js as:

```javascript
const mapboxAPIKey = process.env.API_KEY_MAPBOX;
const climacellAPIKey = process.env.API_KEY_CLIMACELL;
```

The easiest way to reference your keys locally is to create a .env file in the root directory with the keys assigned
and use the dotenv package (include with npm install) to attach them to process.env. Make sure to .gitignore your .env file! For online 'live' usage, add your keys as an environment variable through whatever service you use (as I did with Heroku).

If you would like to see the full JSON object that is returned on the custom endpoint use the following address
`https://weather.jamesedens.me/weather?address=<location>`
Where `<location>` is the city or address. For example `https://weather.jamesedens.me/weather?address=redding`.

Here is an example parsed JSON return

<details>
<summary>Parsed JSON</summary>

```json
{
  "geocode": {
    "type": "Geocode",
    "Latitude": 40.5864,
    "Longitude": -122.3917,
    "Location": "Redding, California, United States"
  },
  "currentForecast": {
    "temp": 38.75,
    "units": "F",
    "windSpeed": 12.58,
    "windUnits": "mph",
    "windDirection": 176.75,
    "precipitation": 0.0433,
    "precipitationUnits": "in/hr",
    "humidity": 83.25,
    "feelsLike": 30.88,
    "cardinalWindHeading": "S",
    "precipitationType": "rain",
    "precipWord": "Light",
    "weatherCode": "rain_light"
  },
  "futureForecast": {
    "hourWeather": [
      {
        "time": "2021-01-27T01:00:00.000Z",
        "temp": "39F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "60%",
        "weatherCode": "cloudy",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T02:00:00.000Z",
        "temp": "39F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "51%",
        "weatherCode": "cloudy",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T03:00:00.000Z",
        "temp": "38F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "60%",
        "weatherCode": "cloudy",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T04:00:00.000Z",
        "temp": "37F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "100%",
        "weatherCode": "snow_heavy",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T05:00:00.000Z",
        "temp": "36F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "100%",
        "weatherCode": "snow_heavy",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T06:00:00.000Z",
        "temp": "36F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "100%",
        "weatherCode": "snow_heavy",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T07:00:00.000Z",
        "temp": "34F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "100%",
        "weatherCode": "snow_heavy",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T08:00:00.000Z",
        "temp": "33F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "100%",
        "weatherCode": "snow_heavy",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T09:00:00.000Z",
        "temp": "33F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "100%",
        "weatherCode": "snow_heavy",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T10:00:00.000Z",
        "temp": "33F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "90%",
        "weatherCode": "flurries",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T11:00:00.000Z",
        "temp": "33F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "70%",
        "weatherCode": "snow_heavy",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T12:00:00.000Z",
        "temp": "34F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "70%",
        "weatherCode": "cloudy",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T13:00:00.000Z",
        "temp": "33F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "90%",
        "weatherCode": "snow",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T14:00:00.000Z",
        "temp": "35F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "80%",
        "weatherCode": "cloudy",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T15:00:00.000Z",
        "temp": "33F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "51%",
        "weatherCode": "snow_light",
        "dayNight": "night"
      },
      {
        "time": "2021-01-27T16:00:00.000Z",
        "temp": "33F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "40%",
        "weatherCode": "cloudy",
        "dayNight": "day"
      },
      {
        "time": "2021-01-27T17:00:00.000Z",
        "temp": "35F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "21%",
        "weatherCode": "cloudy",
        "dayNight": "day"
      },
      {
        "time": "2021-01-27T18:00:00.000Z",
        "temp": "37F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "31%",
        "weatherCode": "cloudy",
        "dayNight": "day"
      },
      {
        "time": "2021-01-27T19:00:00.000Z",
        "temp": "45F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "25%",
        "weatherCode": "cloudy",
        "dayNight": "day"
      },
      {
        "time": "2021-01-27T20:00:00.000Z",
        "temp": "41F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "50%",
        "weatherCode": "rain_light",
        "dayNight": "day"
      },
      {
        "time": "2021-01-27T21:00:00.000Z",
        "temp": "43F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "50%",
        "weatherCode": "rain_light",
        "dayNight": "day"
      },
      {
        "time": "2021-01-27T22:00:00.000Z",
        "temp": "44F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "55%",
        "weatherCode": "drizzle",
        "dayNight": "day"
      },
      {
        "time": "2021-01-27T23:00:00.000Z",
        "temp": "44F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChanceAtHour": "55%",
        "weatherCode": "drizzle",
        "dayNight": "day"
      },
      {
        "time": "2021-01-28T00:00:00.000Z",
        "temp": "44F",
        "sunrise": "2021-01-28T15:22:30.213Z",
        "sunset": "2021-01-29T01:23:01.690Z",
        "rainChanceAtHour": "55%",
        "weatherCode": "drizzle",
        "dayNight": "night"
      },
      {
        "time": "2021-01-28T01:00:00.000Z",
        "temp": "44F",
        "sunrise": "2021-01-28T15:22:30.213Z",
        "sunset": "2021-01-29T01:23:01.690Z",
        "rainChanceAtHour": "60%",
        "weatherCode": "drizzle",
        "dayNight": "night"
      },
      {
        "time": "2021-01-28T02:00:00.000Z",
        "temp": "43F",
        "sunrise": "2021-01-28T15:22:30.213Z",
        "sunset": "2021-01-29T01:23:01.690Z",
        "rainChanceAtHour": "60%",
        "weatherCode": "drizzle",
        "dayNight": "night"
      }
    ],
    "rainChanceIn24Hours": 100
  },
  "dailyForecast": {
    "dailyWeather": [
      {
        "time": "2021-01-26",
        "minTemp": "34F",
        "maxTemp": "42F",
        "sunrise": "2021-01-27T15:23:21.851Z",
        "sunset": "2021-01-28T01:21:49.074Z",
        "rainChance": "85%",
        "weatherCode": "snow_heavy",
        "observationDate": "2021-01-26T00:00:00.000Z"
      },
      {
        "time": "2021-01-27",
        "minTemp": "34F",
        "maxTemp": "42F",
        "sunrise": "2021-01-28T15:22:30.213Z",
        "sunset": "2021-01-29T01:23:01.690Z",
        "rainChance": "75%",
        "weatherCode": "rain",
        "observationDate": "2021-01-27T00:00:00.000Z"
      },
      {
        "time": "2021-01-28",
        "minTemp": "34F",
        "maxTemp": "42F",
        "sunrise": "2021-01-29T15:21:36.761Z",
        "sunset": "2021-01-30T01:24:14.480Z",
        "rainChance": "40%",
        "weatherCode": "rain_light",
        "observationDate": "2021-01-28T00:00:00.000Z"
      },
      {
        "time": "2021-01-29",
        "minTemp": "34F",
        "maxTemp": "42F",
        "sunrise": "2021-01-30T15:20:41.531Z",
        "sunset": "2021-01-31T01:25:27.406Z",
        "rainChance": "75%",
        "weatherCode": "rain_light",
        "observationDate": "2021-01-29T00:00:00.000Z"
      },
      {
        "time": "2021-01-30",
        "minTemp": "34F",
        "maxTemp": "42F",
        "sunrise": "2021-01-31T15:19:44.553Z",
        "sunset": "2021-02-01T01:26:40.432Z",
        "rainChance": "45%",
        "weatherCode": "drizzle",
        "observationDate": "2021-01-30T00:00:00.000Z"
      },
      {
        "time": "2021-01-31",
        "minTemp": "34F",
        "maxTemp": "42F",
        "sunrise": "2021-02-01T15:18:45.863Z",
        "sunset": "2021-02-02T01:27:53.524Z",
        "rainChance": "90%",
        "weatherCode": "rain_light",
        "observationDate": "2021-01-31T00:00:00.000Z"
      },
      {
        "time": "2021-02-01",
        "minTemp": "34F",
        "maxTemp": "42F",
        "sunrise": "2021-02-02T15:17:45.495Z",
        "sunset": "2021-02-03T01:29:06.650Z",
        "rainChance": "95%",
        "weatherCode": "flurries",
        "observationDate": "2021-02-01T00:00:00.000Z"
      }
    ]
  }
}
```
</details>

### UPCOMING FEATURES

- ~~Full 12 hours forecast for the current day.~~
- ~~Different icons for day and day.~~
- ~~5 day forecast for the week.~~
- Add winds to Daily forecast.
- Format and Style fixes.
