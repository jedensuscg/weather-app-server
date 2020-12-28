Node.JS Weather App Webserver
web server for weather app course on udemy.com.
https://www.udemy.com/course/the-complete-nodejs-developer-course-2/

Extensive modifications to the orignal course.
You can view the LIVE app at https://weather.jamesedens.me

If you wish to use this and expand on it some key things to know are:
1) run npm install to download required npm packages

2) You will need to register for your own Climacell and Mapbox API keys.
No keys are included with for obvious reasons.

3) You will them need to reference your keys. The keys are referenced in 
src/app.js as:
const mapbox_api = process.env.API_KEY_MAPBOX;
const climacell_api = process.env.API_KEY_CLIMACELL;

The easiest way to refer your keys is locally is to create a .env file in the root directory
and use the dotenv (include with npm install) to attach them to process.env.  For online use,
save your keys as an environment variable (as I did with Heroku).
