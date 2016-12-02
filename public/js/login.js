'use strict';

var app = app || {};

$("#btn-login").on("click", (ev) => {
    let username = $("#tb-username").val();
    let password = $("#tb-password").val();

    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    let data = {
        username,
        password
    }

    app.requester.post("/auth/login", data)
        .then(resp => {
            if (resp.success) {
                app.notificator.showNotification(resp.success, "success")
                setTimeout(() => { window.location.href = "/" }, 1000)
            } else if (resp.error) {
                app.notificator.showNotification(resp.error, "error")
            }
        })
        .catch(err => {
            console.log(err)
        });
})