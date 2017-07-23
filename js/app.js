'use strict';

const GOOGLE_PLACES = {
    url : "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    key : "AIzaSyDWmnY0GfjllGfQUwp5ytwEcXudmS6axEo",
};

function listenForInput() {
    $("#search-form").submit(event => {
        event.preventDefault();
        var searchLocation = $(".js-searchLocation").val();
        console.log(searchLocation);
    })
}

function initPlaces(inputElem) {
    var autocomplete = new google.maps.places.Autocomplete(inputElem, {types: ['(cities)']});
    autocomplete.addListener('place_changed', function () {
    })
    // var place = autocomplete.getPlace();
}

// var getLocationGeocode = function(searchLocation) {
//     const query = {
//         key: GOOGLE_PLACES.key,
//         location:
//         radius:
//     }
//     $.getJSON(GOOGLE_PLACES.url, )
// }

$(function(){
const inputElem = $('.js-searchLocation')[0];
listenForInput();
initPlaces(inputElem);
})