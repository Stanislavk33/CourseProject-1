'use strict';

var app = app || {};

$("#btn-login").on("click", function(ev) {
    ev.preventDefault();

    var username = $("#tb-username").val(),
        password = $("#tb-password").val(),
        data = {
            username,
            password
        }

    app.requester.post("/auth/login", data)
        .then(function(resp) {
            if (resp.success) {
                app.notifier.showNotification(resp.success, "success");
                setTimeout(function() { window.location.href = "/" }, 500);
            } else if (resp.error) {
                app.notifier.showNotification(resp.error, "error");
                return;
            }
        })
        .catch(function(err) {
            app.notifier.showNotification("Login unsuccessful.", "error");
        });
})