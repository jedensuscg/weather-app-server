console.log('Client Side Javascript loaded');



const weatherForm = document.querySelector('form');
const search = document.querySelector('input');


weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const location = search.value;

    fetch(`http://localhost:3000/weather?address=${location}`).then((response) => {
        response.json().then((data) => {
            if (data.errorMsg) {
                console.log(`ERROR: ${data.errorMsg}`);
            } else {
                console.log(data.geocode.Location)
                console.log(`Current Temp is: ${data.currentForecast.temp}`);
            }
        });
    });
})