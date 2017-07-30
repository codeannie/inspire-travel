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

var UserLocation = {
    latitude: undefined,
    longitude: undefined,
    city: undefined,
};

//GET LOCATION 
function userSubmit() {
    $("#search-form").submit(event => {
        event.preventDefault();
        var searchLocation = $(".js-searchLocation").val();
    })
}

function initPlaces(inputElem) {
    var autocomplete = new google.maps.places.Autocomplete(inputElem, {types: ['(cities)']});
    autocomplete.addListener('place_changed', function () {
        STATE.googlePlace = autocomplete.getPlace();
        STATE.geolat = STATE.googlePlace.geometry.location.lat(),
        STATE.geoLng = STATE.googlePlace.geometry.location.lng(),
        // STATE.geoLoc = {
        //     lat: STATE.googlePlace.geometry.location.lat(),
        //     long: STATE.googlePlace.geometry.location.lng()
        // }
        console.log(STATE.geoLoc);
    })
    // var place = autocomplete.getPlace();
}

// https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch3.md
// Doug Mason & Russel Thomas - Promises 

// WEATHER 

    //   "Latitude": 35.683,
    //   "Longitude": 139.809,

function getCityData() {
    let param = {
        q : `${STATE.geoLat}, ${STATE.geoLng}`,
        apikey: ACCUWEATHER.key,
    }

    $.getJSON(ACCUWEATHER.geoposition_url, param)
        .then(getForecastData);
        // .then(function(json) {
        //     return key; 
        // };
        // console.log(json); 
        // STATE.cityKey = key,  
    // console.log(STATE.cityKey); 
}

function getForecastData() {
    
    if(res[0]){
        let weatherLocationKey = res[0].key;
    
    let param = {
        apikey: ACCUWEATHER.key,
    }

    $.getJSON(ACCUWEATHER.forecast_url + weatherLoctitonKey, param)
    .then (function (res) {

    })

}

// TIME 

// PHOTOS

//research AJAX $(document).ready() - line 69 and on is short hand 
//don't load line 69~ javascript until DOM is ready
//for DOM related functions 

$(function(){
const inputElem = $('.js-searchLocation')[0];
userSubmit();
initPlaces(inputElem);
getCityData();
// getForecastData();
})
