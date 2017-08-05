'use strict';

const GOOGLE = {
    places_url : "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    timezone_url : "https://maps.googleapis.com/maps/api/timezone/json?",
    key : "AIzaSyDWmnY0GfjllGfQUwp5ytwEcXudmS6axEo",
};

const ACCUWEATHER = {
    geoposition_url: "https://dataservice.accuweather.com/locations/v1/cities/geoposition/search",
    forecast_url : "https://dataservice.accuweather.com/forecasts/v1/daily/5day/",
    key : "cx6Pjbnt98biCTe5Gz68RhiLGWPK5Nrp",
};

const FLICKR = {
    url: " https://api.flickr.com/services/rest/?method=flickr.photos.search&",
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

//don't load until DOM is ready
//for DOM related functions 
$(function(){
const inputElem = $('.js-searchLocation')[0];
initPlaces(inputElem);
handleSubmit();
});

//GET LOCATION 

// Get information from Google API - lat, long, name 
function initPlaces(inputElem) {
    var autocomplete = new google.maps.places.Autocomplete(inputElem, {types: ['(cities)']});
    autocomplete.addListener('place_changed', function () {
        STATE.googlePlace = autocomplete.getPlace();

        // if there is no ID, we haven't gotten a real place
        // so we want to exit the function;
        if (!STATE.googlePlace.id) 
            return; 
        //need to add user facing alert

        STATE.geoLat = STATE.googlePlace.geometry.location.lat();
        STATE.geoLng = STATE.googlePlace.geometry.location.lng();
        STATE.cityName = STATE.googlePlace.formatted_address;

        getCityData();
        getLocationTime();
        displayLocationName();
        getPhotoData();
    })
    // console.log(STATE);
}

//Display Location Name 
function displayLocationName() {
    $(".location-name").text(`${STATE.cityName}`);
}

// WEATHER 

//GET GEO DATA TO GET CITYKEY AND USE CITYKEY TO GET FORECAST API 
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
        .then (function (forecast) {
            const forecastElm = $(".weather");
            console.log(forecast);
                //this is variable   //how to change until condition false (prevent infinite loop)
            for (var i = 0; i<Math.min (2, forecast.DailyForecasts.length); i++) {
                        //math is library in javascript 

                let forecastItem = forecast.DailyForecasts[i];
                forecastItem.Day.Icon = forecastItem.Day.Icon <= 9 ? '0' + forecastItem.Day.Icon  : forecastItem.Day.Icon ;
                //access to the item in the array 
                //& pull out properties of the array in weatherHTML

                let weatherHTML = (
                `<div class="weather-card">
                    <img src="https://developer.accuweather.com/sites/default/files/${forecastItem.Day.Icon}-s.png" width="75" height="45" alt="icon for ${forecastItem.IconPhrase}">
                    <span class="weather-max> ${forecastItem.Temperature.Maximum.Value} °F</span> <br>
                    <span class="weather-min> ${forecastItem.Temperature.Minimum.Value} °F</span> <br>
                    <span class="weather-desc> ${forecastItem.IconPhrase} </span> <br>  
                    ${forecastItem.Epoch}.toLocaleString();
                </div>`);

            forecastElm
                .append(weatherHTML);
        }         
    });
}

// function renderForecast() {
// }

// getFormattedDate(forecastItem.EpochDate);

// function getFormatedDate() {
    
//     var today = new Date();
//     var dd = today.getDate();
//     var mm = today.getMonth() + 1;

//     if(dd < 10) { dd = '0' + dd; }
//     if(mm < 10) { mm = '0' + mm; }

//     return dd+'/'+mm+'/' + today.getFullYear();
    
// }

// TIME 

// GET USER TIME -- not sure if this is necessary 
function getUserTime () {
    var date = moment().format("MMMM Do YY, h:mm:ss a");
    // console.log(date);
}

// GET SUBMITTED LOCATION TIME
function getLocationTime () {
    var targetDate = new Date() // Current date/time of user computer
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
            // console.log(STATE.cityTime);

            //how to format this output? 
            //how to show time refreshed every minute?
            $("#location-time").text(STATE.cityTime); 
        })
}
    
// PHOTOS
function getPhotoData() {
    let param = {
        lat: `${STATE.geoLat}`,
        lon: `${STATE.geoLng}`,
        api_key: FLICKR.key,
        format: "json",
        nojsoncallback: 1,
        privacy_filter: 1,
        safe_search: 1, 
        per_page: 10,
    }
    $.getJSON(FLICKR.url, param)
        .then(function(json_photos) {
            // console.log(json_photos.photos.photo[0]);

            //Flickr Photo Source URL
            // https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
            var {farm, id, secret, server} = json_photos.photos.photo[0];
            // console.log(farm);

            // for (var i=0; i<json_photos.length; i++) {
                const photoURL = (
                    `<img src="https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg" 
                        alt="image from ${STATE.cityName}"></a>`
                );
                // console.log(photoURL);
                $(".photos").append(photoURL);
            // }
        }).catch(function(err){
            console.log(err);
        })
}

//prevents submit to happen
function handleSubmit() {
    $("#search-form").submit(event => {
        event.preventDefault();
        return false; //do nothing
    })
}

