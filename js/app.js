'use strict';

const GOOGLE_PLACES = {
    url : "https://maps.googleapis.com/maps/api/geocode/json",
    key : "AIzaSyDWmnY0GfjllGfQUwp5ytwEcXudmS6axEo",
};

function listenForInput() {
    $("#search-form").submit(event => {
        event.preventDefault();
        var searchLocation = $(".js-searchLocation").val();
        console.log(searchLocation);
    })
}


// var getLocationGeocode = function(searchLocation) {
//     const query = {
//         part:
//         key:
//         q:
//     }
//     $.getJSON(GOOGLE_PLACES.url, )
// }

listenForInput();