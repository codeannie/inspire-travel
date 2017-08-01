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

const FLICKR = {
    // url: "https://flickr.photos.geo.photosForLocation",
    // url: "https://api.flickr.com/services/rest/?method=flickr.photos.search&",
    url: "https://api.flickr.com/services/flickr.photos.search/json/",
    key: "7faa8e131c5e122b2c8641a0f601cef6",
    secret: "b37b20e78b51a47b",
};

const HTML = {
    landingPage: ".landing-page",
    searchForm: "#search-form",
    weather: ".weather",
    time: ".time",
    photos: ".photos"
};

const STATE = {
    googlePlace : null,
    geoLat: null,
    geoLng: null,
    cityKey: null,
    cityName: null,
    cityTime: null,
};

//GET LOCATION 

// Get information from Google API - lat, long, name 
// Should this function name be changed?
function initPlaces(inputElem) {
    var autocomplete = new google.maps.places.Autocomplete(inputElem, {types: ['(cities)']});
    autocomplete.addListener('place_changed', function () {
        STATE.googlePlace = autocomplete.getPlace();
        // console.log(STATE.googlePlace);
        STATE.geoLat = STATE.googlePlace.geometry.location.lat();
        STATE.geoLng = STATE.googlePlace.geometry.location.lng();
        STATE.cityName = STATE.googlePlace.formatted_address;

        getCityData();
        getLocationTime();
        displayLocationName();
    })
    // console.log(STATE);
}

//Display Location Name 
function displayLocationName() {
    $(".location-name").text(`${STATE.cityName}`);
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

// TIME 

// GET USER TIME -- not sure if this is necessary 
function getUserTime () {
    var date = moment().format("MMMM Do YY, h:mm:ss a");
    // console.log(date);
}

// GET SUBMITTED LOCATION TIME
function getLocationTime () {
    var targetDate = new Date() // Current date/time of user computer
    // var targetDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    let param = {
        location: `${STATE.geoLat},${STATE.geoLng}`,
        // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
        timestamp: targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60,
        key: GOOGLE.key, 
    }

    $.getJSON(GOOGLE.timezone_url, param)
        .then(function(json_time) {
            var dstOffset = json_time.dstOffset
            var rawOffset = json_time.rawOffset
            var timeZone = json_time.timeZoneId
            // console.log(json_time);
            STATE.cityTime = new Date((param.timestamp + dstOffset + rawOffset) * 1000);

            //using moment.js -- not calculating correctly
            // STATE.cityTime = moment.tz(param.timestamp, timeZone).format("YYYY-MM-DD hh:mm:ss a");
            // STATE.cityTime = moment.tz(param.timestamp, timeZone).format("ha z");

            // let timeHTML = 
            //     `{<div class="time-box">Location Time: <span id="location-time">${cityTime}</span></div>}`
           
            // console.log(STATE.cityTime);
            $("#location-time").text(STATE.cityTime);
        })
        // .append(timeHTML);
}

function displayLocationTime() {
    var daysofweek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
    var refreshDate = new Date()
    var milliSecondsLapsed = refreshDate - targetDate
}

// function displayLocationTime() {
//     if (json_time.status === 200){ // if Ajax request successful
//     var output = JSON.parse(json_time.responseText) // convert returned JSON string to JSON object
//     console.log(output.status) // log API return status for debugging purposes
        
//         if (output.status == 'OK'){ // if API reports everything was returned successfully
//             var offsets = output.dstOffset * 1000 + output.rawOffset * 1000 // get DST and time zone offsets in milliseconds
//             var localdate = new Date(timestamp * 1000 + offsets) // Date object containing current time of Tokyo (timestamp + dstOffset + rawOffset)
//             // console.log(localdate.toLocaleString()) // Display current Tokyo date and time
//             var refreshDate = new Date() // get current date again to calculate time elapsed between targetDate and now
//             var millisecondselapsed = refreshDate - targetDate // get amount of time elapsed between targetDate and now
            
//             localdate.setMilliseconds(localdate.getMilliseconds()+ millisecondselapsed) // update localdate to account for any time elapsed
            
//             setInterval(function(){
//             localdate.setSeconds(localdate.getSeconds()+1)
//             container.innerHTML = localdate.toLocaleTimeString() + ' (' + daysofweek[ localdate.getDay() ] + ')'
//         }, 1000)
//     }
//        }else{
//         alert('Request failed.  Returned status of ' + json_time.status)
//         console.log(output);
//         }
// }

// PHOTOS
function getPhotoData() {
    let param = {
        lat: `${STATE.geoLat}`,
        lon: `${STATE.geoLng}`,
        api_key: FLICKR.key,
        privacy_filter: 1,
        safe_search: 1, 
        per_page: 10,
        page: 3, 
    }

    $.getJSON(FLICKR.url, param)
        .then(function(json_photos) {
            // alert("Photos!");
            // console.log(json_photos);

            // for (var i=0, i<json_photos.length, i++) {

            // }
        })
}

// function displayPhotos() {
//     let photoHTML = {}
// }


function handleSubmit() {
    $("#search-form").submit(event => {
        event.preventDefault();
        if (STATE.googlePlace.id === undefined) {
            alert('Select a location!')
        }
        // var searchLocation = $(".js-searchLocation").val();
    })
}

// function handleSubmit(event) {
//     if(event) {
//         event.preventDefault();
//         return;
//     }
// }

//research AJAX $(document).ready()
//don't load line 69~ javascript until DOM is ready
//for DOM related functions 
$(function(){
const inputElem = $('.js-searchLocation')[0];
initPlaces(inputElem);
handleSubmit();
getUserTime();
// getLocationTime();
// getCityData();
// getForecastData();
});

// https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch3.md
// Doug Mason & Russel Thomas - Promises 