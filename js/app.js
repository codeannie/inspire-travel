'use strict'

const GOOGLE = {
  places_url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  timezone_url: 'https://maps.googleapis.com/maps/api/timezone/json?',
  key: 'AIzaSyDWmnY0GfjllGfQUwp5ytwEcXudmS6axEo'
}

const W_UNDERGROUND = {
  forecast_url: 'https://api.wunderground.com/api/774b008f96e3393e/forecast/q/',
  key: '774b008f96e3393e'
}

const FLICKR = {
  url: ' https://api.flickr.com/services/rest/?method=flickr.photos.search&',
  key: '7faa8e131c5e122b2c8641a0f601cef6',
  secret: 'b37b20e78b51a47b'
}

const STATE = {
  googlePlace: null,
  geoLat: null,
  geoLng: null,
  cityName: null,
  cityTime: null
}

// don't load until DOM is ready
// for DOM related functions
$(function () {
  const inputElem = $('.js-searchLocation')[0]
  initPlaces(inputElem);
  handleSubmit();
})

// GET LOCATION

// Get information from Google API - lat, long, name
function initPlaces (inputElem) {
  var autocomplete = new google.maps.places.Autocomplete(inputElem, {types: ['(cities)']})
  autocomplete.addListener('place_changed', function () {
    STATE.googlePlace = autocomplete.getPlace()
        // if there is no ID, we haven't gotten a real place
        // so we want to exit the function;
    if (!STATE.googlePlace.id) { return }

    STATE.geoLat = STATE.googlePlace.geometry.location.lat()
    STATE.geoLng = STATE.googlePlace.geometry.location.lng()
    STATE.cityName = STATE.googlePlace.formatted_address

    renderPlace(STATE)
  })
}

function renderPlace () {
  getForecastData()
  getLocationTime()
  displayLocationName()
  getPhotoData()

  $('.results').prop('hidden', false);
  $('.landing').prop('hidden', true);
  $('.demo_button').prop('hidden', true);
  $('.search_button').prop('hidden', false);
}

// DISPLAY LOCATION NAME
function displayLocationName () {
  $('.location-name').text(`${STATE.cityName}`);
}

// WEATHER
function getForecastData () {
  console.log(W_UNDERGROUND.forecast_url + `${STATE.geoLat},${STATE.geoLng}` + '?callback=')
  $.ajax({
    url: W_UNDERGROUND.forecast_url + `${STATE.geoLat},${STATE.geoLng}` + '.json?callback=',
    dataType: 'jsonp',
    success: function (response) {
      renderForecastData(response)
    }
  })
}

function renderForecastData (jsonWeather) {
  let weatherHTML = ''

  $.each(jsonWeather.forecast.simpleforecast.forecastday, function (idx, forecastItem) {
    weatherHTML += (

      `<div class="col-3">
          <div class="weather-card">
              <p class="forecast-day">${forecastItem.date.weekday_short}, ${forecastItem.date.month}/${forecastItem.date.day}/${forecastItem.date.year}</p>
              <img class="forecast-icon" src="https://icons.wxug.com/i/c/k/${forecastItem.icon}.gif" alt="icon for ${forecastItem.conditions}">
              <p class="forecast-text"> High ${forecastItem.high.fahrenheit} °F</p>
              <p class="forecast-text"> Low ${forecastItem.low.fahrenheit} °F</p> 
              <p class="forecast-text"> ${forecastItem.conditions} </p> 
          </div>
      </div>`)
  })

  $('.weather-container')
        .empty()
        .append(weatherHTML);
}

// TIME
function getLocationTime () {
  var targetDate = new Date() // Current date/time of user computer
  let param = {
    location: `${STATE.geoLat},${STATE.geoLng}`,
        // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
    timestamp: targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60,
    key: GOOGLE.key
  }
  $.getJSON(GOOGLE.timezone_url, param)
        .then(function (json_time) {
          var daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
          var dstOffset = json_time.dstOffset
          var rawOffset = json_time.rawOffset
          var timeZone = json_time.timeZoneId

          STATE.cityTime = new Date((param.timestamp + dstOffset + rawOffset) * 1000)
          
          $('.location-time').text(`${daysOfWeek[STATE.cityTime.getDay()]}, ${STATE.cityTime.toLocaleString()}`);
        })
}

// PHOTOS
function getPhotoData () {
  let param = {
    lat: `${STATE.geoLat}`,
    lon: `${STATE.geoLng}`,
    tags: 'nature, city, outdoor, fun, explore, travel, indoor, adventure',
    radius: 32,
    is_getty: 'true',
    api_key: FLICKR.key,
    format: 'json',
    nojsoncallback: 1,
    privacy_filter: 1,
    safe_search: 1,
    per_page: 9
  }
  $.getJSON(FLICKR.url, param)
        .then(function (json_photos) {
          const photosArr = json_photos.photos.photo
          let photoHTML = `<h3 class="photo-title">Photos from ${STATE.cityName} <i class="material-icons">photo_camera</i></h3>`

          for (var i = 0; i < photosArr.length; i++) {
            var {farm, id, secret, server} = photosArr[i]

            photoHTML += (
                    `
                    <div class="col-6">
                            <img class="thumbnail" src="https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg" alt="Image from ${STATE.cityName}">
                    </div>`
                )
          }
          $('#gallery')
                    .empty()
                    .append(photoHTML);
        }).catch(function (err) {
          console.log(err)
        })
}

// prevents submit to happen
function handleSubmit () {
  $('#search-form').submit(event => {
    event.preventDefault()
    return false // do nothing
  })
}

// Try Me button
var Demo = function () {
  STATE.geoLat = 21.3069444
  STATE.geoLng = -157.8583333
  STATE.cityName = 'Honolulu, HI, USA'

  renderPlace(STATE)
}

// Search Again button
var searchAgain = function () {
  $('.results').prop('hidden', true);
  $('.landing').prop('hidden', false);
  $('.demo_button').prop('hidden', false);
  $('.search_button').prop('hidden', true);
  $('.js-searchLocation').empty();
}
