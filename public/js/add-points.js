/* globals $ */

'use strict';

var app = app || {};

$('.addPoints').on('click', function(ev) {

    let element = $(ev.target),
        username = element.attr('data-username'),
        points = +element.attr('data-points'),
        category = element.attr('data-category'),
        competitionId = $('#info').attr('data-id');

    ev.preventDefault();
    const data = {
        username,
        points,
        category,
        competitionId
    };

    app.requester.put('/users/addPoints', data)
        .then(resp => {
            $("#add-points-btn").addClass("hidden");
            $("#points-added").removeClass("hidden");
            app.notifier.showNotification(resp, "success");
        })
        .catch(err => {
            console.log(err);
        })

    // $.ajax('/users/addPoints', {
    //     method: 'PUT',
    //     data: JSON.stringify(data),
    //     contentType: 'application/json'
    // }).
    // done(() => {
    //         toastr.success('magic');
    //     })
    //     .fail(() => {
    //         toastr.error('You are a fail!')
    //     })
});