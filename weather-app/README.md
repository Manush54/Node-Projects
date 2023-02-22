# Weather App CLI version

## This node app integrates front-end and backend code for Weather App.

## How to use:
- Install the repository.
- Run the below code by placing any location in the arguments.
> node app.js \<location>

## APIs used:
- mapbox.com
- weatherstack.com

## Working:
1. Coordinates like latitude, longitude and location are fetched from the mapbox api
2. These coordinates are then provided to the weatherstack api to fetch weather information.
3. The data fetched includes:
    - Temperature
    - Precipitation
    - Weather Description