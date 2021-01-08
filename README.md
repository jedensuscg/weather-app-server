# Node.JS Weather App Webserver and front-end UI.
View the app at [https://weather.jamesedens.me](https://weather.jamesedens.me)
- [Node.JS Weather App Webserver and front-end UI.](#nodejs-weather-app-webserver-and-front-end-ui)
    - [ABOUT](#about)
    - [CURRENT FEATURES](#current-features)
    - [USAGE](#usage)
    - [UPCOMING FEATURES](#upcoming-features)

### ABOUT
This is a full application that is continuing the app created through a course on udemy.com.
https://www.udemy.com/course/the-complete-nodejs-developer-course-2/

Extensive additions to the original course.
You can view the LIVE app at [https://weather.jamesedens.me](https://weather.jamesedens.me)
NOTE* Live implementation running on Heroku free dynamo. Thus, if the app has no been used in 30 minutes it is unloaded and will take about 10-20 seconds for the server to boot up on Heroku's end. Please wait.

Back end webserver created in Node.JS and ExpressJS. Basic templates handled through handlebars. (Footer and header mostly). 

### CURRENT FEATURES
- Easy geocoding
    - Get location from a simple city name, all the way to a full address. The first address that the API returns is used, so state may be required. For example entering Redding returns Redding, California US. So if you need Redding, Indiana, type Redding IN
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

Here is an example parsed JSON return

```json
{
    "geocode": {
    "type": "Geocode",
    "Latitude": 36.2957,
    "Longitude": -76.2248,
    "Location": "Elizabeth City, North Carolina, United States"
    },
    "currentForecast": {
    "temp": 45.61,
    "units": "F",
    "windSpeed": 9.23,
    "windUnits": "mph",
    "windDirection": 295.69,
    "precipitation": 0,
    "precipitationUnits": "in/hr",
    "humidity": 58.06,
    "feelsLike": 45.61,
    "cardinalWindHeading": "WNW",
    "precipitationType": "none",
    "precipWord": "Light",
    "weatherCode": "clear"
    },
    "futureForecast": {
    "hourWeather": [
    {
    "time": "3 pm",
    "temp": "45F",
    "rainChanceAtHour": "0%",
    "weatherCode": "clear"
    },
    {
    "time": "4 pm",
    "temp": "44F",
    "rainChanceAtHour": "0%",
    "weatherCode": "clear"
    },
    {
    "time": "5 pm",
    "temp": "41F",
    "rainChanceAtHour": "0%",
    "weatherCode": "mostly_clear"
    },
    {
    "time": "6 pm",
    "temp": "39F",
    "rainChanceAtHour": "0%",
    "weatherCode": "clear"
    },
    {
    "time": "7 pm",
    "temp": "38F",
    "rainChanceAtHour": "0%",
    "weatherCode": "mostly_cloudy"
    },
    {
    "time": "8 pm",
    "temp": "37F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "9 pm",
    "temp": "36F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "10 pm",
    "temp": "36F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "11 pm",
    "temp": "36F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "12 am",
    "temp": "35F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "1 am",
    "temp": "35F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "2 am",
    "temp": "36F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "3 am",
    "temp": "36F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "4 am",
    "temp": "36F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "5 am",
    "temp": "36F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "6 am",
    "temp": "37F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "7 am",
    "temp": "37F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "8 am",
    "temp": "38F",
    "rainChanceAtHour": "0%",
    "weatherCode": "cloudy"
    },
    {
    "time": "9 am",
    "temp": "40F",
    "rainChanceAtHour": "5%",
    "weatherCode": "cloudy"
    },
    {
    "time": "10 am",
    "temp": "43F",
    "rainChanceAtHour": "25%",
    "weatherCode": "drizzle"
    },
    {
    "time": "11 am",
    "temp": "44F",
    "rainChanceAtHour": "25%",
    "weatherCode": "drizzle"
    },
    {
    "time": "12 am",
    "temp": "44F",
    "rainChanceAtHour": "20%",
    "weatherCode": "cloudy"
    },
    {
    "time": "1 pm",
    "temp": "44F",
    "rainChanceAtHour": "15%",
    "weatherCode": "cloudy"
    },
    {
    "time": "2 pm",
    "temp": "44F",
    "rainChanceAtHour": "15%",
    "weatherCode": "drizzle"
    },
    {
    "time": "3 pm",
    "temp": "44F",
    "rainChanceAtHour": "15%",
    "weatherCode": "drizzle"
    },
    {
    "time": "4 pm",
    "temp": "43F",
    "rainChanceAtHour": "10%",
    "weatherCode": "partly_cloudy"
    }
    ],
    "rainChanceIn24Hours": 25
    }
    }
```


### UPCOMING FEATURES
- ~~Full 12 hours forecast for the current day.~~
- Different icons for day and day.
- 5 day forecast for the week.
