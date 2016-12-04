/* globals google $ */

'use strict';

var app = app || {};

var marker;

function initMap() {
    var coordinates = { lat: 42.6977, lng: 23.3219 },
        map = new google.maps.Map(document.getElementById('map'), {
            center: coordinates,
            zoom: 10
        });

    google.maps.event.addListener(map, 'click', function(event) {
        marker = addMarker(event.latLng, map, marker);
    });
}

function addMarker(location, map, oldMarker) {
    var marker = new google.maps.Marker({
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

    var latitude = marker.getPosition().lat(),
        longitude = marker.getPosition().lng(),
        competitionName = $("#competitionName").val(),
        place = $("#place").val(),
        description = $("#description").val(),
        points = $("#points").val(),
        level = $("#level").val(),
        category = $("#category").val(),
        startDate = $("#startDate").val(),
        endDate = $("#endDate").val(),
        image = $('#tb-competition')[0].files[0];

    var formData = new FormData();
    formData.append('competitionImage', image);
    formData.append('competitionName', competitionName);
    formData.append('place', place);
    formData.append('description', description);
    formData.append('points', points);
    formData.append('level', level);
    formData.append('category', category);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);

    ev.preventDefault();

    app.requester.postWithFile('/competitions/create', formData)
        .then(function(resp) {
            if (resp.success) {
                app.notifier.showNotification(resp.success, "success");
                setTimeout(function() { window.location.href = '/competitions/' + resp.competition.id }, 500);
            } else if (resp.error) {
                app.notifier.showNotification(resp.error, "error");
                return;
            }
            //app.notifier.showNotification(resp, "success");
        })
        .catch(function(err) {
            app.notifier.showNotification("Competition could not be created.", "error");
        });
});