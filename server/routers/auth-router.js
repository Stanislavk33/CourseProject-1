const express = require('express');

module.exports = (app, data) => {
    const controller = require('./../controllers/auth-controller')(data);

    const router = new express.Router();

    router
        .get('/register', controller.loadRegisterPage)
        .post('/register', controller.register)
        .get('/login', controller.loadLoginPage)
        .post('/login', controller.loginLocal)

    app.use('/auth', router);
}