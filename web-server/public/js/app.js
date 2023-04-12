console.log('Client side javascript file is loaded!')

const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const address = document.querySelector('#location')
const temp = document.querySelector('#temp')
const humidity = document.querySelector('#humidity')
const desc = document.querySelector('#desc')
const precip = document.querySelector('#precip')
const feelsLike = document.querySelector('#feelsLike')
const weather_img = document.querySelector('#weather_img')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const location = search.value

    address.innerHTML = 'Loading...'
    temp.innerHTML = ''
    humidity.innerHTML = ''
    desc.innerHTML = ''
    precip.innerHTML = ''
    feelsLike.innerHTML = ''
    weather_img.src = ''

    fetch(`http://localhost:3000/weather?address=${location}`).then(response => {
        response.json().then(data => {
            if(data.error) {
                address.innerHTML = data.error
            } else {
                address.innerHTML = "Location : " + data.location
                temp.innerHTML = "Temperature : " + data.forecast.temperature + " degrees"
                humidity.innerHTML = "Humidity : " + data.forecast.humidity + " %"
                desc.innerHTML = "Description : " + data.forecast.desc
                precip.innerHTML = "Precipitation : " + data.forecast.precip + " %"
                feelsLike.innerHTML = "Feels like : " + data.forecast.feelsLike + " degrees"
                weather_img.src = data.forecast.img
            }
        })
    })
})