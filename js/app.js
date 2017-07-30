'use strict';

const GOOGLE = {
    places_url : "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    timezone_url : "https://maps.googleapis.com/maps/api/timezone/json?",
    key : "AIzaSyDWmnY0GfjllGfQUwp5ytwEcXudmS6axEo",
};

const ACCUWEATHER = {
    geoposition_url: "https://dataservice.accuweather.com/locations/v1/cities/geoposition/search",
    // cities_url : "https://dataservice.accuweather.com/locations/v1/cities/search",
    forecast_url : "https://dataservice.accuweather.com/forecasts/v1/daily/5day/",
    key : "cx6Pjbnt98biCTe5Gz68RhiLGWPK5Nrp",
};

const HTML = {
    landingPage: ".landing-page",
    searchForm: "#search-form",
    weather: ".weather",
    time: ".time",
    photos: ".photos"
}

const STATE = {
    googlePlace : null,
    geoLat: null,
    geoLng: null,
    cityKey: null,
    cityName: null,
}

//GET LOCATION 
function userSubmit() {
    $("#search-form").submit(event => {
        event.preventDefault();
        if (STATE.googlePlace.id === undefined) {
            alert('Please select a place!')
        }
        // var searchLocation = $(".js-searchLocation").val();
        // getCityData();
    })
}

// Get information from Google API - lat, long, name 
function initPlaces(inputElem) {
    var autocomplete = new google.maps.places.Autocomplete(inputElem, {types: ['(cities)']});
    autocomplete.addListener('place_changed', function () {
        STATE.googlePlace = autocomplete.getPlace();
        // console.log(STATE.googlePlace);
        STATE.geoLat = STATE.googlePlace.geometry.location.lat();
        STATE.geoLng = STATE.googlePlace.geometry.location.lng();
        STATE.cityName = STATE.googlePlace.formatted_address;
        // console.log(STATE.cityName);
        getCityData();
        getLocationTime();
    })
}

// WEATHER 

//PLUG IN GEO DATA INTO FORECAST API 
function getCityData() {
    let param = {
        q : `${STATE.geoLat},${STATE.geoLng}`,
        apikey: ACCUWEATHER.key,
    }

    $.getJSON(ACCUWEATHER.geoposition_url, param)
        .then(getForecastData);
}

function getForecastData(json_weather) {
    STATE.cityKey = json_weather.Key;  

    let param = {
        apikey: ACCUWEATHER.key,
    }

    $.getJSON(ACCUWEATHER.forecast_url + STATE.cityKey, param)
    .then (function (json_weather) {
    var data = json_weather
    
    //render parts needed from that variable/object
    //using angular with {{}} <--this is more recommended & easier 
    //set up HTML variables and use as syntax 
        //data.celsius temp 

    //jquery $(<insert class>) - to get
        //more laborious
    // console.log(json)
    })
}

//display Forecast into boxes - 1 day? 3 day? 
// function weatherHTML() {
// }

//use ANGULAR 

// GET USER TIME
function getUserTime () {
    var date = moment().format("MMMM Do YY, h:mm:ss a");
    // console.log(date);
}

// GET SUBMITTED LOCATION TIME
function getLocationTime () {
    var targetDate = new Date()
    var daysofweek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
    let param = {
        location: `${STATE.geoLat},${STATE.geoLng}`,
        timestamp: targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60,
        key: GOOGLE.key, 
    }
    $.getJSON(GOOGLE.timezone_url, param)
    .then(function(json_time) {
     console.log(json_time);
    })
}
// PHOTOS

//research AJAX $(document).ready()
//don't load line 69~ javascript until DOM is ready
//for DOM related functions 
$(function(){
const inputElem = $('.js-searchLocation')[0];
initPlaces(inputElem);
userSubmit();
getUserTime();
// getLocationTime();
// getCityData();
// getForecastData();
});

// https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch3.md
// Doug Mason & Russel Thomas - Promises 