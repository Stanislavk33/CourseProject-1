'use strict';

var app = app || {};

console.log(app);

$("#btn-login").on("click", (ev) => {
    ev.preventDefault();

    let username = $("#tb-username").val();
    let password = $("#tb-password").val();


    let data = {
        username,
        password
    }

    console.log(data);

    app.requester.post("/auth/login", data)
        .then(resp => {
            if (resp.success) {
                app.notifier.showNotification(resp.success, "success");
                setTimeout(() => { window.location.href = "/" }, 500);
            } else if (resp.error) {
                app.notifier.showNotification(resp.error, "error");
                return;
            }
        })
        .catch(err => {
            console.log('in catch');
            console.log(err)
        });
})