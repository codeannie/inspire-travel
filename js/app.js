'use strict';

const G_PLACESINFO = {
    url : "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    key : "AIzaSyDWmnY0GfjllGfQUwp5ytwEcXudmS6axEo",
};

const ACCUWEATHER = {
    geoposition_url: "https://dataservice.accuweather.com/locations/v1/cities/geoposition/search",
    // cities_url : "https://dataservice.accuweather.com/locations/v1/cities/search",
    forecast_url : "https://dataservice.accuweather.com/forecasts/v1/daily/5day/",
    key : "cx6Pjbnt98biCTe5Gz68RhiLGWPK5Nrp",
};

// const W_UNDERGROUND = {
//     // url : "http://api.wunderground.com/api/key/geolookup/q/json", //not sure if this is correct
//     url: `"http://api.wunderground.com/api/”+ key +”/forecast/geolookup/conditions/q/" + Geo.lat + "," + Geo.lng + ".json"`,
//     key : "774b008f96e3393e",
// }

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
}

// var UserLocation = {
//     latitude: undefined,
//     longitude: undefined,
//     city: undefined,
// };

//GET LOCATION 
function userSubmit() {
    $("#search-form").submit(event => {
        event.preventDefault();
        console.log(STATE.googlePlace);
        if (STATE.googlePlace.id === undefined) {
            alert('Please select a place!')
        }
        // var searchLocation = $(".js-searchLocation").val();
        // getCityData();
    })
}

function initPlaces(inputElem) {
    var autocomplete = new google.maps.places.Autocomplete(inputElem, {types: ['(cities)']});
    autocomplete.addListener('place_changed', function () {
        STATE.googlePlace = autocomplete.getPlace();
        STATE.geoLat = STATE.googlePlace.geometry.location.lat();
        STATE.geoLng = STATE.googlePlace.geometry.location.lng();
        // console.log(STATE);
        getCityData();
    })
}

// https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch3.md
// Doug Mason & Russel Thomas - Promises 

// WEATHER 
// 35.683,139.809
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

// TIME 

// PHOTOS

//research AJAX $(document).ready() - line 69 and on is short hand 
//don't load line 69~ javascript until DOM is ready
//for DOM related functions 

$(function(){
const inputElem = $('.js-searchLocation')[0];
initPlaces(inputElem);
userSubmit();
// getCityData();
// getForecastData();
})
