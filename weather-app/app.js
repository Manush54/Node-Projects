const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

if(!process.argv[2]){
    console.log('Please provide an address')
} else {
    geocode(process.argv[2], (error, { latitude, longitude, location } = {}) => {
        if(error) {
            return console.log(error)
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return console.log(error)
            }
    
            console.log(location)
            console.log(forecastData)
        })
    })
}
