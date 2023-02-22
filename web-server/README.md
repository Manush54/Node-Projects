# Web-server for Weather App

## This node app integrates front-end and backend code for Weather App.

## How to use:
- Install the repository.
- Replace the mapbox and weatherstack api keys with yours.
- Run the app and open localhost.
- Search any location in the search box.

## APIs used:
- mapbox.com
- weatherstack.com

## Working:
1. Coordinates like latitude, longitude and location are fetched from the mapbox api
2. These coordinates are then provided to the weatherstack api to fetch weather information.
3. The data fetched includes:
    - Temperature
    - Humidity
    - Precipitation
    - Weather Description
    - Feels Like
    - Weather Icon