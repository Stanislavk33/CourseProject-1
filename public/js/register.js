'use strict';

var app = app || {};

$("#btn-register").on("click", (ev) => {
    var pattern = new RegExp(/^[a-zA-Z0-9]{6,50}$/),
        testUsername,
        testFirstName,
        testLastName,
        username = $("#tb-username").val(),
        email = $("#tb-email").val(),
        password = $("#tb-password").val(),
        confirmPassword = $("#tb-confirm-password").val(),
        birthDate = $("#tb-datepicker").val(),
        firstName = $("#tb-first-name").val(),
        lastName = $("#tb-last-name").val(),
        image = $("#tb-avatar")[0].files[0];

    testUsername = pattern.test(username);
    testFirstName = pattern.test(firstName);
    testLastName = pattern.test(lastName);
    
    if (!testUsername) {
        console.log("testUsername");
        app.notifier.showNotification("Username must contain only letters, numbers and must be between 6 and 50 symbols long", "error");
        return;
    }

    if (password !== confirmPassword) {
        app.notifier.showNotification("Password doesnt match!");
    }

    if (!testFirstName) {
        app.notifier.showNotification("First name must contain only letters, numbers and must be between 6 and 50 symbols long", "error");
        return;
    }

    if (!testLastName) {
        app.notifier.showNotification("Last name must contain only letters, numbers and must be between 6 and 50 symbols long", "error");
        return;
    }

    let formData = new FormData();
    formData.append('avatar', image);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('birthDate', birthDate);

    app.requester.postWithFile('/auth/register', formData)
        .then(resp => {

            if (resp.success) {
                app.notifier.showNotification(resp.success, "success");
                setTimeout(function() {
                    window.location.href = "/auth/login";
                }, 1000);
            }
            else if (resp.error) {
                app.notifier.showNotification(resp.error, "error");
            }
        })
        .catch(err => {
            console.log(err);
        })

        ev.preventDefault();
})