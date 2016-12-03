'use strict';

var app = app || {};

console.log(app);

$("#btn-register").on("click", (ev) => {
    ev.preventDefault();

    var nameAndPassPattern = new RegExp(/^[a-zA-Z0-9]{6,50}$/),
        emailPattern = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
        testUsername,
        testFirstName,
        testLastName,
        testEmail,
        testPassword,
        username = $("#tb-username").val(),
        email = $("#tb-email").val(),
        password = $("#tb-password").val(),
        confirmPassword = $("#tb-confirm-password").val(),
        birthDate = $("#tb-datepicker").val(),
        firstName = $("#tb-first-name").val(),
        lastName = $("#tb-last-name").val(),
        image = $("#tb-avatar")[0].files[0];

    testUsername = nameAndPassPattern.test(username);
    testFirstName = nameAndPassPattern.test(firstName);
    testLastName = nameAndPassPattern.test(lastName);
    testPassword = nameAndPassPattern.test(password) && nameAndPassPattern.test(confirmPassword);
    testEmail = emailPattern.test(email);



    if (!testUsername) {
        app.notifier.showNotification("Username must contain only letters, numbers and must be between 6 and 50 symbols long", "error");
        return;
    }

    if(!testEmail) {
        app.notifier.showNotification("Email is not correct", "error");
        return;
    }


    if (password !== confirmPassword) {
        console.log('case');
        app.notifier.showNotification("Password doesnt match!", "error");
        return;
    }

    if(!testPassword) {
        app.notifier.showNotification("Password must contain only letters, numbers and must be between 6 and 50 symbols long", "error");
        return;
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

    console.log(formData);

    app.requester.postWithFile('/auth/register', formData)
        .then(resp => {
            if (resp.success) {
                app.notifier.showNotification(resp.success, "success");
                setTimeout(function () {
                    window.location.href = "/auth/login";
                }, 500);
            }
            else if (resp.error) {
                app.notifier.showNotification(resp.error, "error");
                return;
            }
        })
        .catch(err => {
            console.log(err);
        })

})