const request = require('postman-request')


const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=80b01fd2915245da2edd0b20e424c37d&query=${latitude},${longitude}`
    
    request({url, json:true}, (err, {body} = {}) => {
        if(err) {
            callback('Unable to connect to weather service!')
        } else if (body.error) {
            callback('Unable to find location')
        } else {
            callback(
                undefined,
                // `${body.current.weather_descriptions[0]}.It is currently ${body.current.temperature} degrees out. There is ${body.current.precip} % chance of rain.`
                {
                    desc: body.current.weather_descriptions[0],
                    temperature : body.current.temperature,
                    precip : body.current.precip,
                    humidity : body.current.humidity,
                    feelsLike: body.current.feelslike,
                    img: body.current.weather_icons[0]
                }
                )
        }
    })

}

module.exports = forecast