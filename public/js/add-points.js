'use strict';

$('.addPoints').on('click', function (ev) {

    let dataId = $(this).attr('data-id'),
        devider = dataId.indexOf(' '),
        username = dataId.substr(0, devider),
        points = +dataId.substr(devider + 1, dataId.length),
        category = $(this).attr('data-category');

    ev.preventDefault();
    const data = {
        username,
        points,
        category
    };

    $.ajax('/users/addPoints', {
        method: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).
        done(() => {
            toastr.success('magic');
        })
        .fail(() => {
            toastr.error('You are a fail!')
        })
});