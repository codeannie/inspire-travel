'use strict'

const GOOGLE = {
  places_url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
  timezone_url: 'https://maps.googleapis.com/maps/api/timezone/json?',
  key: 'AIzaSyDWmnY0GfjllGfQUwp5ytwEcXudmS6axEo'
}

const W_UNDERGROUND = {
  forecast_url: 'https://api.wunderground.com/api/774b008f96e3393e/forecast/q/',
  icons_url: 'https://icons.wxug.com/i/c/i/ICON.gif',
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
  cityKey: null,
  cityName: null,
  cityTime: null,
}

// don't load until DOM is ready
// for DOM related functions
$(function () {
  const inputElem = $('.js-searchLocation')[0]
  initPlaces(inputElem)
  handleSubmit()
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

  $('.results').prop('hidden', false)
  $('.landing').prop('hidden', true)
  $('.demo_button').prop('hidden', true)
  $('.search_button').prop('hidden', false)
}

// DISPLAY LOCATION NAME
function displayLocationName () {
  $('.location-name').text(`${STATE.cityName}`)
}

// WEATHER
function getForecastData () {
  console.log(W_UNDERGROUND.forecast_url + `${STATE.geoLat},${STATE.geoLng}` + '?callback=')
  $.ajax({
    url: W_UNDERGROUND.forecast_url + `${STATE.geoLat},${STATE.geoLng}` + '.json?callback=',
    dataType: 'jsonp',
    success: function (response) {
      console.log(response);
      renderForecastData(response)
    }
  })
}

function renderForecastData (jsonWeather) {
  let weatherHTML = ''

  $.each(jsonWeather.forecast.txt_forecast.forecastday, function (idx, forecastItem) {
    console.log(forecastItem)
    weatherHTML += (

      `<div class="col-3">
          <div class="weather-card">
              <p class="forecast-day">${forecastItem.title} </p>
              <img class="forecast-icon" src="https://icons.wxug.com/i/c/i/${forecastItem.icon}.gif" alt="icon for ${forecastItem.icon}">
              <p class="forecast-text"> ${forecastItem.fcttext} </p>
          </div>
      </div>`)
  })

  $('.weather-container')
        .empty()
        .append(weatherHTML)
}

function getFormattedDate (dtVal) {
  let weekday = new Array(7)
  weekday[0] = 'Sun'
  weekday[1] = 'Mon'
  weekday[2] = 'Tues'
  weekday[3] = 'Wed'
  weekday[4] = 'Thurs'
  weekday[5] = 'Fri'
  weekday[6] = 'Sat'
  let dt = new Date(dtVal * 1000)
  let dtString = `${weekday[dt.getDay()]}, ${dt.getMonth()}/${dt.getDate()}/${dt.getFullYear()}`
  return dtString
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
          var dstOffset = json_time.dstOffset
          var rawOffset = json_time.rawOffset
          var timeZone = json_time.timeZoneId

          STATE.cityTime = new Date((param.timestamp + dstOffset + rawOffset) * 1000)

            // Extra -  format input to remove GMT
          $('.location-time').text(STATE.cityTime)
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
                    .append(photoHTML)
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
  $('.results').prop('hidden', true)
  $('.landing').prop('hidden', false)
  $('.demo_button').prop('hidden', false)
  $('.search_button').prop('hidden', true)
  $('.js-searchLocation').empty()
}
