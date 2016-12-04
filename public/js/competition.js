/* globals google $*/

'use strict';

function initMap() {
  var lat = $("#latitude").html();
  var lng = $("#longitude").html();
  var coordinates = { lat: +lat, lng: +lng },
    map = new google.maps.Map(document.getElementById('map'), {
      center: coordinates,
      zoom: 10
    });

  var marker = new google.maps.Marker({
    position: coordinates,
    map: map,
    title: 'Competition!'
  });

  google.maps.event.addListenerOnce(map, 'idle', function () {
    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
    }, 1000);
  });
}