'use strict';

const GOOGLE = {
    places_url : "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    timezone_url : "https://maps.googleapis.com/maps/api/timezone/json",
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
        console.log(STATE.googlePlace);
        STATE.geoLat = STATE.googlePlace.geometry.location.lat();
        STATE.geoLng = STATE.googlePlace.geometry.location.lng();
        STATE.cityName = STATE.googlePlace.formatted_address;
        console.log(STATE.cityName);
        getCityData();
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

function getForecastData(json) {
    STATE.cityKey = json.Key;  

    let param = {
        apikey: ACCUWEATHER.key,
    }

    $.getJSON(ACCUWEATHER.forecast_url + STATE.cityKey, param)
    .then (function (json) {
        console.log(json)
    })
}

//display Forecast into boxes - 1 day? 3 day? 
function weatherHTML() {

}

// USER LOCAL TIME
function getUserTime () {
    var date = moment().format("MMMM Do YY, h:mm:ss a");
    console.log(date);
}
// LOCATION TIME
// function getLocationTime () {
//     let param = {
//         q: 
//     }
// }
// PHOTOS

//research AJAX $(document).ready() - line 69 and on is short hand 
//don't load line 69~ javascript until DOM is ready
//for DOM related functions 

$(function(){
const inputElem = $('.js-searchLocation')[0];
initPlaces(inputElem);
userSubmit();
getUserTime();
// getCityData();
// getForecastData();
})

// https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch3.md
// Doug Mason & Russel Thomas - Promises 