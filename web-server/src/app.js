// Modules Required
const path = require('path')
const express = require('express')
const hbs = require('hbs')

// Custom Files Required
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Express Init
const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Root URI request
app.get('/', (req,res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Manush Shah'
    })
})

// About page request
app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About Me',
        name : 'Manush Shah'
    })
})

// Help page request
app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        name: 'Manush Shah',
        message : 'Connect with me on help@manush.com for any queries.'
    })
})

// Weather page request
app.get('/weather', (req, res) => {
    const address = req.query.address;
    
    if(!address){
        return res.send({error : 'Please provide an address'})
    }
    
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if(error) {
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({error})
            }
            res.send({
                address,
                location,
                forecast : forecastData,
            })
        })
    })

})

// Get any urls after help. i.e. /help/data, help/article1/text
app.get('/help/*', (req,res) => {
    res.render('404', {
        title: "404 Page",
        name : "Manush Shah",
        errorMessage: "Help article not found!"
    })
})

// Get all the urls.
app.get('*', (req, res) => {
    res.render('404', {
        title: "404 Page",
        name : "Manush Shah",
        errorMessage: "Page not found"
    })
})

// Make express listen on specific port for any requests (get, post, etc.).
app.listen(3000, () => {
    console.log('Server is up and running on port 3000')
})