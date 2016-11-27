function initMap() {
  let marker;

  let coordinates = { lat: 47.502934, lng: 19.034850 };
  let map = new google.maps.Map(document.getElementById('map'), {
    center: coordinates,
    zoom: 10
  });

  let marker2 = new google.maps.Marker({
    position: coordinates,
    map: map,
    title: 'Competition!'
  });

}