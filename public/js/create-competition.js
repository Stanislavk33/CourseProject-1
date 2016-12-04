/* globals google $ */

'use strict';

var app = app || {};

let marker;

function initMap() {
    let coordinates = { lat: 42.6977, lng: 23.3219 },
        map = new google.maps.Map(document.getElementById('map'), {
            center: coordinates,
            zoom: 10
        });

    google.maps.event.addListener(map, 'click', function(event) {
        marker = addMarker(event.latLng, map, marker);
    });
}

function addMarker(location, map, oldMarker) {
    let marker = new google.maps.Marker({
        position: location,
        map: map
    });

    if (oldMarker) {
        oldMarker.setMap(null);
    }

    return marker;
}

$(function() {
    $(".datepicker").datepicker({ dateFormat: "yyyy-mm-dd" });
});

$("#create").on("click", function(ev) {
    if (!marker) {
        app.notifier.showNotification("You should choose a location on the map", "error");

        ev.preventDefault();
        return false;
    }

    let latitude = marker.getPosition().lat();
    let longitude = marker.getPosition().lng();
    let competitionName = $("#competitionName").val();
    let place = $("#place").val();
    let description = $("#description").val();
    let points = $("#points").val();
    let level = $("#level").val();
    let category = $("#category").val();
    let startDate = $("#startDate").val();
    let endDate = $("#endDate").val();
    let image = $('#tb-competition')[0].files[0];

    let formData = new FormData();
    formData.append('competitionImage', image);
    formData.append('competitionName', competitionName);
    formData.append('place', place);
    formData.append('description',description);
    formData.append('points', points);
    formData.append('level', level);
    formData.append('category', category);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);

    ev.preventDefault();

    app.requester.postWithFile('/competitions/create', formData)
        .then(resp => {
             if (resp.success) {
                app.notifier.showNotification(resp.success, "success");
                setTimeout(() => { window.location.href = `/competitions/${resp.competition.id}` }, 500);
            } else if (resp.error) {
                app.notifier.showNotification(resp.error, "error");
                return;
            }
            //app.notifier.showNotification(resp, "success");
        })
        .catch(err => {
             app.notifier.showNotification(resp.error, "Competition could not be created.");
        });
});